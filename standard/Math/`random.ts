export {}
import Ns = Math

declare global {
    namespace Math {
        interface RandomBetweenParams {
            rounded?: boolean
        }
    }
    interface Math {
        /**
         *
         * @param {number} from from - default 0
         * @param {number} to to - default 1
         * @param {{rounded: boolean}} params {rounded: boolean}
         * @returns
         */
        randomBetween(from: number, to: number, params?: Ns.RandomBetweenParams): number
    }
}

Object.assign(Math, {
    randomBetween(from: number = 0, to: number = 1, params?: Ns.RandomBetweenParams): number {
        from ??= 0
        to ??= 1

        return Math.random() * (params?.rounded ? to - from + 1 : to - from) + from
    },
})
