export {}

declare global {
    interface Map<K, V> {
        /**
         * Type-safe has() check that narrows Map type
         *
         * After checking if a key exists, TypeScript knows that get() will
         * return V (not V | undefined) for that key. This enables safer
         * type narrowing patterns with Map.
         *
         * @example
         * ```typescript
         * const map = new Map<string, number>()
         * map.set('count', 42)
         *
         * if (map.has('count')) {
         *   const value = map.get('count') // Type: number (not number | undefined)
         *   console.log(value * 2) // Safe to use without null check
         * }
         * ```
         *
         * @template P - Key type (subset of K)
         * @param key - Key to check
         * @returns true if key exists, with type narrowing
         */
        has<P extends K>(key: P): this is { get(key: P): V } & this
        // funny thing: `& this` is the final piece of the puzzle
    }
}
