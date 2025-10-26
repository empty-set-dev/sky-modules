export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        shuffle(): this
    }
}

Object.defineProperty(Array.prototype, 'shuffle', {
    value: function shuffle<T>(this: T[]): T[] {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[this[i], this[j]] = [this[j], this[i]]
        }

        return this
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
