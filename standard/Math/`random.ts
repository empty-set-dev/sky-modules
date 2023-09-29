export interface Math__randomBetweenParams {
    rounded?: boolean
}
export function Math__random_between(
    from: number = 0,
    to: number = 1,
    params?: Math__randomBetweenParams
): number {
    from ??= 0
    to ??= 1

    return Math.random() * (params?.rounded ? to - from + 1 : to - from) + from
}
