type Callback<A extends unknown[], R> =
    | ((...args: A) => R)
    | [unknown, (this: unknown, ...args: A) => R]

export default Callback

export function invokeCallback<A extends unknown[], R>(callback: Callback<A, R>, ...args: A): R {
    if (Array.isArray(callback)) {
        return callback[1].apply(callback[0], args)
    }

    return callback(...args)
}
