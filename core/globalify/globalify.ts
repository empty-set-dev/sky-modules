import mergeNamespace from '@sky-modules/core/mergeNamespace'

import { InvalidScopeError, PrototypePollutionError } from './errors'

interface Scope {
    [key: string]: unknown | Scope
}

// Dangerous keys that could lead to prototype pollution
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype']

function validateKey(key: string): void {
    if (DANGEROUS_KEYS.includes(key)) {
        throw new PrototypePollutionError(key)
    }
}

function canBecameScope(scope: unknown): scope is Scope {
    return (
        scope !== null &&
        (typeof scope === 'undefined' || typeof scope === 'object' || typeof scope === 'function')
    )
}

function globalify(module: Record<PropertyKey, unknown>): void {
    mergeNamespace(global, module)
}

define('sky.core.globalify', globalify)
export default globalify

define('sky.core.globalify.namespace', globalify.namespace)
globalify.namespace = function namespace(ns: string, module: Record<PropertyKey, unknown>): void {
    const parts = ns.split('.')
    let scope: Scope = global

    for (let i = 0; i < parts.length; i++) {
        const key = parts[i]

        // Validate key for prototype pollution
        validateKey(key)

        if (!canBecameScope(scope[key])) {
            throw new InvalidScopeError(ns)
        }

        scope[key] ??= {}
        scope = <Scope>scope[key]

        if (i === parts.length - 1) {
            mergeNamespace(scope, module)
        }
    }
}
