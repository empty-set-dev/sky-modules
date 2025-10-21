import define from '../define'
import { DANGEROUS_KEYS } from '../errors/constants'
import { InvalidScopeError, PrototypePollutionError } from '../errors/security-errors'
import mergeNamespace from '../mergeNamespace'

interface Scope {
    [key: string]: unknown | Scope
}

function validateKey(key: string): void {
    if ((DANGEROUS_KEYS as readonly string[]).includes(key)) {
        throw new PrototypePollutionError(key)
    }
}

function canBecameScope(scope: unknown): scope is Scope {
    return (
        scope !== null &&
        (typeof scope === 'undefined' || typeof scope === 'object' || typeof scope === 'function')
    )
}

define('sky.core.globalify', globalify)
export default function globalify(module: Record<PropertyKey, unknown>): void {
    mergeNamespace(global, module)
}

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
