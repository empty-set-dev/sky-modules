export {}

declare global {
    interface Math {
        /**
         * @param {number} from default 0
         * @param {number} to default 1
         * @returns {number}
         */
        randomBetween(from: number, to: number): number

        /**
         * @param {number} from default 0
         * @param {number} to default 1
         * @returns {number}
         */
        roundedRandomBetween(from: number, to: number): number
    }
}

Object.assign(Math, {
    randomBetween(from: number = 0, to: number = 1): number {
        return Math.random() * (to - from) + from
    },

    roundedRandomBetween(from: number = 0, to: number = 0): number {
        return Math.floor(Math.random() * (to - from + 1) + from)
    },
})
