export {}

declare global {
    interface Math {
        /**
         * Clamp a value between min and max bounds
         *
         * Also known as clamp function. Ensures value stays within range.
         *
         * @example
         * ```typescript
         * Math.minmax(5, 0, 10) // 5
         * Math.minmax(-5, 0, 10) // 0
         * Math.minmax(15, 0, 10) // 10
         * Math.minmax(7, 5, 5) // 5
         * ```
         *
         * @param value - Value to clamp
         * @param min - Minimum bound
         * @param max - Maximum bound
         * @returns Value clamped between min and max
         */
        minmax(value: number, min: number, max: number): number
    }
}

Math.minmax = function minmax(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}
