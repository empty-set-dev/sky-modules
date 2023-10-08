export default function Fc<A extends unknown[], T>(
    callback: (...args: A) => T
): {
    new (...args: A): T
    prototype: T
} {
    return function Object(...args: A) {
        callback.apply(this, args)
        return this
    } as never
}

Fc.forward = function <A extends unknown[], T>(
    callback: (...args: A) => T
): {
    new (...args: A): T
    prototype: T
} {
    return callback as never
}
