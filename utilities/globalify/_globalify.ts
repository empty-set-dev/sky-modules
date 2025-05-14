export default function globalify(module: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    Object.assign(globalScope, module)
}

globalify.namespace = function (namespace: string, module: object): void {
    const namespacesArray = namespace.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scope: any = typeof global === 'undefined' ? window : global
    namespacesArray.forEach((namespace, i) => {
        scope[namespace] ??= {}
        scope = scope[namespace]

        if (i === namespacesArray.length - 1) {
            Object.assign(scope, module)
        }
    })
}
