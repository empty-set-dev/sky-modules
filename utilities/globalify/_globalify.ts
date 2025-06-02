export default function globalify(module: Record<string, unknown>): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    merge(globalScope, module)
}

globalify.namespace = function (namespace: string, module: Record<string, unknown>): void {
    const namespacesArray = namespace.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scope: any = typeof global === 'undefined' ? window : global
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
