export {}

declare global {
    interface Array<T> {
        last(): T | undefined
        last<D>(defaultValue: D): T | D
    }
}

Object.defineProperty(Array.prototype, 'last', {
    value: function last<T, D>(this: T[], defaultValue?: D): T | D | undefined {
        const lastItem = this[this.length - 1]
        return lastItem !== undefined ? lastItem : defaultValue
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
