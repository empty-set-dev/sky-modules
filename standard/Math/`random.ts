export {}
import Ns = Math

declare global {
    namespace Math {
        interface RandomBetweenParams {
            rounded?: boolean
        }
    }
}

Object.assign(Math, {
    randomBetween(from: number = 0, to: number = 1, params?: Ns.RandomBetweenParams): number {
        from ??= 0
        to ??= 1

        return Math.random() * (params?.rounded ? to - from + 1 : to - from) + from
    },
})
