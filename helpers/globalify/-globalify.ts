export default function globalify(module: object): void {
    const globalScope = typeof global === 'undefined' ? window : global

    Object.keys(module).map(k => {
        if (!globalScope[k]) {
            globalScope[k] = module[k]
        }
    })
}
