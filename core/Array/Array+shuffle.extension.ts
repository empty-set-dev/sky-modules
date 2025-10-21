export {}

declare global {
    interface Array<T> {
        shuffle(): this
    }
}

if (!Array.prototype.shuffle) {
    Object.defineProperty(Array.prototype, 'shuffle', {
        value: function <T>(this: T[]): T[] {
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
}
