import * as module from '.'

Object.assign(Math, {
    randomBetween: module.Math__randomBetween,
})

declare global {
    interface Math {
        randomBetween(from: number, to: number, params?: module.Math__random_betweenParams): number
    }
}
