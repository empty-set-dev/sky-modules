export {}

declare global {
    interface Math {
        randomBetween(from: number, to: number): number
        roundedRandomBetween(from: number, to: number): number
    }
}

Math.randomBetween = function randomBetween(from: number = 0, to: number = 1): number {
    return Math.random() * (to - from) + from
}

Math.roundedRandomBetween = function roundedRandomBetween(
    from: number = 0,
    to: number = 0
): number {
    return Math.floor(Math.random() * (to - from + 1) + from)
}
