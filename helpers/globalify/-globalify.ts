export default function globalify(lib: object): void {
    const globalScope = typeof global === 'undefined' ? window : global

    Object.keys(lib).map(k => {
        if (!globalScope[k]) {
            globalScope[k] = lib[k]
        }
    })
}
