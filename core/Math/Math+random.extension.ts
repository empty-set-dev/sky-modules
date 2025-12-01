export {}

declare global {
    interface Math {
        /**
         * Generate random float between two numbers
         *
         * @example
         * ```typescript
         * Math.randomBetween(0, 1) // e.g., 0.7234
         * Math.randomBetween(5, 10) // e.g., 7.4582
         * Math.randomBetween(-5, 5) // e.g., -2.3491
         * ```
         *
         * @param from - Lower bound (inclusive)
         * @param to - Upper bound (exclusive)
         * @returns Random float in range [from, to)
         */
        randomBetween(from: number, to: number): number
        /**
         * Generate random integer between two numbers (inclusive)
         *
         * @example
         * ```typescript
         * Math.roundedRandomBetween(1, 6) // Dice roll: 1-6
         * Math.roundedRandomBetween(0, 100) // Percentage: 0-100
         * Math.roundedRandomBetween(-10, 10) // e.g., -3
         * ```
         *
         * @param from - Lower bound (inclusive)
         * @param to - Upper bound (inclusive)
         * @returns Random integer in range [from, to]
         */
        roundedRandomBetween(from: number, to: number): number
    }
}

Math.randomBetween = function randomBetween(from: number = 0, to: number = 1): number {
    return Math.random() * (to - from) + from
}

Math.roundedRandomBetween = function roundedRandomBetween(
    from: number = 0,
    to: number = 0
): number {
    return Math.floor(Math.random() * (to - from + 1) + from)
}
