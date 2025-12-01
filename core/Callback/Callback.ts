/**
 * Type for callbacks that can be either regular functions or bound methods
 *
 * Supports two forms:
 * 1. Regular function: `(...args) => result`
 * 2. Bound method: `[context, function]` where function will be called with context as `this`
 *
 * @template A - Argument types tuple
 * @template R - Return type
 *
 * @example
 * ```typescript
 * // Regular function callback
 * const callback1: Callback<[number], string> = (x) => String(x)
 *
 * // Bound method callback
 * const obj = { prefix: 'Value: ' }
 * const callback2: Callback<[number], string> = [obj, function(x) {
 *   return this.prefix + x
 * }]
 *
 * invokeCallback(callback1, 42) // '42'
 * invokeCallback(callback2, 42) // 'Value: 42'
 * ```
 */
type Callback<A extends unknown[], R> =
    | ((...args: A) => R)
    | [unknown, (this: unknown, ...args: A) => R]

export default Callback

/**
 * Invoke a callback with proper context handling
 *
 * Handles both regular functions and bound method tuples,
 * ensuring correct `this` context for method callbacks.
 *
 * @example
 * ```typescript
 * const fn = (x: number) => x * 2
 * invokeCallback(fn, 5) // 10
 *
 * const obj = { multiplier: 3 }
 * const method: Callback<[number], number> = [obj, function(x) {
 *   return x * this.multiplier
 * }]
 * invokeCallback(method, 5) // 15
 * ```
 *
 * @template A - Argument types
 * @template R - Return type
 * @param callback - Function or [context, function] tuple
 * @param args - Arguments to pass to callback
 * @returns Result of callback execution
 */
export function invokeCallback<A extends unknown[], R>(callback: Callback<A, R>, ...args: A): R {
    if (Array.isArray(callback)) {
        return callback[1].apply(callback[0], args)
    }

    return callback(...args)
}
