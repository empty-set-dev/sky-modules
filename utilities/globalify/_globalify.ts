export default function globalify(lib: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalScope: any = typeof global === 'undefined' ? window : global

    Object.keys(lib).map(k => {
        if (!globalScope[k]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            globalScope[k] = (lib as any)[k]
        }
    })
}
