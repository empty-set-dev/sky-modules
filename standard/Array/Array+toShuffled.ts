export {}

declare global {
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
;[1, 2, 3].map((_item, _i) => {
    //
})
