type NestedNamespace = {[k: PropertyKey]: NestedNamespace}

declare const window: NestedNamespace
declare const global: NestedNamespace

define('sky.standard.globalify', globalify)
export default function globalify(module: Record<PropertyKey, unknown>): void {
    const globalScope = typeof global === 'undefined' ? window : global
    merge(globalScope, module)
}

define('sky.standard.globalify.namespace', globalify.namespace)
globalify.namespace = function (namespace: string, module: Record<string, unknown>): void {
    const namespacesArray = namespace.split('.')
    let scope = typeof global === 'undefined' ? window : global
    namespacesArray.forEach((namespace, i) => {
        scope[namespace] ??= {}
        scope = scope[namespace]

        if (i === namespacesArray.length - 1) {
            merge(scope, module)
        }
    })
}

function merge(scope: Record<string, unknown>, module: Record<string, unknown>): void {
    Object.keys(module).forEach(k => {
        if (
            scope[k] &&
            typeof scope[k] === 'function' &&
            typeof module[k] === 'object' &&
            !Array.isArray(module)
        ) {
            Object.assign(scope[k], module[k])
        } else if (
            scope[k] &&
            typeof scope[k] === 'object' &&
            typeof module[k] === 'function' &&
            !Array.isArray(scope[k])
        ) {
            Object.assign(module[k], scope[k])
            scope[k] = module[k]
        } else {
            scope[k] = module[k]
        }
    })
}
