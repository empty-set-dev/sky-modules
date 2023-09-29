import * as module from '.'

Object.assign(Math, {
    randomBetween: module.Math__random_between,
})

declare global {
    interface Math {
        randomBetween(from: number, to: number, params?: module.Math__randomBetweenParams): number
    }
}
