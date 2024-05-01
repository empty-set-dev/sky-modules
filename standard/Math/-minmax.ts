export {}

declare global {
    interface Math {
        minmax(value: number, min: number, max: number): number
    }
}

namespace module {
    export function minmax(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value))
    }
}

Object.assign(Math, module)
