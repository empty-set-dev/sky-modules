export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        /**
         * Shuffle array in-place using Fisher-Yates algorithm
         *
         * Mutates the array, randomly reordering its elements.
         * Uses cryptographically secure random number generation.
         *
         * @example
         * ```typescript
         * const arr = [1, 2, 3, 4, 5]
         * arr.shuffle()
         * console.log(arr) // e.g., [3, 1, 5, 2, 4]
         *
         * // Chaining
         * [1, 2, 3].shuffle().map(x => x * 2)
         * ```
         *
         * @returns The same array instance (for chaining)
         */
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
