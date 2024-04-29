export {}

declare global {
    interface Math {
        minmax(min: number, max: number, value: number): number
    }
}

namespace module {
    export function minmax(min: number, max: number, value: number): number {
        return Math.min(max, Math.max(min, value))
    }
}

Object.assign(Math, module)
