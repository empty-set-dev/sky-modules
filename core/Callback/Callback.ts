type Callback<A extends unknown[], R, T> = ((...args: A) => R) | [T, (this: T, ...args: A) => R]
export default Callback

export function invokeCallback<A extends unknown[], R, T>(
    callback: Callback<A, R, T>,
    ...args: A
): R {
    if (Array.isArray(callback)) {
        return callback[1].call(callback[0], ...args)
    }

    return callback(...args)
}
