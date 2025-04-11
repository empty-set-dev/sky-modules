export default function globalify(lib: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    Object.assign(globalScope, lib)
}

globalify.namespace = function (namespace: string, lib: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    globalScope[namespace] ??= {}
    Object.assign(globalScope[namespace], lib)
}
