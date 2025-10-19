export {}

declare global {
    interface Math {
        minmax(value: number, min: number, max: number): number
    }
}

Math.minmax = function minmax(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}
