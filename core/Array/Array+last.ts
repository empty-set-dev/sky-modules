export {}

declare global {
    interface Array<T> {
        last(): T
    }
}

Array.prototype.last = function last<T>(this: T[]): T {
    return this[this.length - 1]
}
Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
})
