export {}

declare global {
    interface Array<T> {
        toShuffled(): Array<T>
    }
}

Object.defineProperty(Array.prototype, 'toShuffled', {
    value: function toShuffled<T>(this: T[]): T[] {
        return this.slice().shuffle()
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
