export {}

declare global {
    interface Array<T> {
        /**
         * Create a shuffled copy of the array
         *
         * Returns a new shuffled array, leaving the original unchanged.
         * Uses Fisher-Yates algorithm with cryptographically secure random.
         *
         * @example
         * ```typescript
         * const original = [1, 2, 3, 4, 5]
         * const shuffled = original.toShuffled()
         * console.log(original) // [1, 2, 3, 4, 5] - unchanged
         * console.log(shuffled) // e.g., [3, 1, 5, 2, 4]
         * ```
         *
         * @returns New shuffled array
         */
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
