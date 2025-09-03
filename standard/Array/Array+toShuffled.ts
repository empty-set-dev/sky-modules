export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        toShuffled(): this
    }
}

Array.prototype.toShuffled = function toShuffled<T>(this: Array<T>): Array<T> {
    return this.slice().shuffle()
}
Object.defineProperty(Array.prototype, 'toShuffled', {
    enumerable: false,
})
