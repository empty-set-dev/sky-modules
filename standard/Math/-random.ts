export {}

declare global {
    interface Math {
        /**
         * @param {number} from number - default 0
         * @param {number} to number - default 1
         * @returns number
         */
        randomBetween(from: number, to: number): number

        /**
         * @param {number} from number
         * @param {number} to number
         * @returns {number} number
         */
        roundedRandomBetween(from: number, to: number): number
    }
}

Object.assign(Math, {
    randomBetween(from: number = 0, to: number = 1): number {
        from ??= 0
        to ??= 1

        return Math.random() * (to - from) + from
    },

    roundedRandomBetween(from: number, to: number): number {
        from ??= 0
        to ??= 1

        return Math.floor(Math.random() * (to - from + 1) + from)
    },
})
