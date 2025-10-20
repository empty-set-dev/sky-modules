export {}

declare global {
    interface Array<T> {
        toShuffled(): Array<T>
    }
}

if (!Array.prototype.toShuffled) {
    Object.defineProperty(Array.prototype, 'toShuffled', {
        value: function <T>(this: T[]): T[] {
            return this.slice().shuffle()
        },
        enumerable: false,
        writable: true,
        configurable: true,
    })
}
