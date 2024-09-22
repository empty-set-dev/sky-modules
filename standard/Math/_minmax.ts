export {}

declare global {
    interface Math {
        /**
         * @param {number} value
         * @param {number} min
         * @param {number} max
         */
        minmax(value: number, min: number, max: number): number
    }
}

namespace lib {
    export function minmax(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value))
    }
}

Object.assign(Math, lib)
