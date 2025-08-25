export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        shuffle(): this
    }
}

Array.prototype.shuffle = function shuffle<T>(this: Array<T>): Array<T> {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this[i], this[j]] = [this[j], this[i]]
    }

    return this
}
Object.defineProperty(Array.prototype, 'shuffle', {
    enumerable: false,
})
