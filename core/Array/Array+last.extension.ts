export {}

declare global {
    interface Array<T> {
        /**
         * Get the last element of the array, or default value if empty
         *
         * @example
         * ```typescript
         * [1, 2, 3].last() // 3
         * [].last() // undefined
         * [].last(0) // 0
         * ['a', 'b'].last('default') // 'b'
         * ```
         *
         * @returns Last element or undefined
         */
        last(): T | undefined
        /**
         * Get the last element of the array, or default value if empty
         *
         * @example
         * ```typescript
         * [1, 2, 3].last(0) // 3
         * [].last(0) // 0
         * [].last('default') // 'default'
         * ```
         *
         * @template D - Type of default value
         * @param defaultValue - Value to return if array is empty
         * @returns Last element or default value
         */
        last<D>(defaultValue: D): T | D
    }
}

Object.defineProperty(Array.prototype, 'last', {
    value: function last<T, D>(this: T[], defaultValue?: D): T | D | undefined {
        const lastItem = this[this.length - 1]
        return lastItem !== undefined ? lastItem : defaultValue
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
