export {}

declare global {
    interface Array<T> {
        /**
         * Remove first occurrence of element from array
         *
         * Mutates the array by removing the first matching element.
         * Uses strict equality (===) for comparison.
         *
         * @example
         * ```typescript
         * const arr = [1, 2, 3, 2]
         * arr.remove(2) // true
         * console.log(arr) // [1, 3, 2]
         *
         * arr.remove(5) // false
         * console.log(arr) // [1, 3, 2]
         * ```
         *
         * @param element - Element to remove
         * @returns true if element was found and removed, false otherwise
         */
        remove(element: T): boolean
    }
}

Object.defineProperty(Array.prototype, 'remove', {
    value: function remove<T>(this: T[], element: T): boolean {
        const elementIndex = this.indexOf(element)

        if (elementIndex === -1) {
            return false
        }

        this.splice(elementIndex, 1)

        return true
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
