export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        shuffle(): this
    }
}

Array.prototype.shuffle = function shuffle<T>(this: Array<T>): Array<T> {
    const self = this

    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[self[i], self[j]] = [self[j], self[i]]
    }

    return this
}
