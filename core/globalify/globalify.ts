import mergeNamespace from 'sky/core/mergeNamespace'

interface Scope {
    [key: string]: unknown | Scope
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

        if (!canBecameScope(scope[key])) {
            throw Error('globalify.namespace: not a scope')
        }

        scope[key] ??= {}
        scope = <Scope>scope[key]

        if (i === parts.length - 1) {
            mergeNamespace(scope, module)
        }
    }
}
