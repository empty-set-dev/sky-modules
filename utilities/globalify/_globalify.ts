export default function globalify(lib: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    Object.assign(globalScope, lib)
}

globalify.namespace = function (namespace: string, lib: object): void {
    const namespacesArray = namespace.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scope: any = typeof global === 'undefined' ? window : global
    namespacesArray.forEach((namespace, i) => {
        scope[namespace] ??= {}
        scope = scope[namespace]

        if (i === namespacesArray.length - 1) {
            Object.assign(scope, lib)
        }
    })
}
