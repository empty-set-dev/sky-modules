/**
 * Create a deferred promise with external resolve/reject control
 *
 * Returns a tuple of [promise, resolve, reject] allowing external control
 * of promise resolution. Useful for:
 * - Coordinating async operations
 * - Event-based promise resolution
 * - Manual promise lifecycle management
 *
 * @example
 * ```typescript
 * // Basic usage
 * const [promise, resolve, reject] = deferred<string>()
 *
 * // Resolve from external event
 * button.addEventListener('click', () => {
 *   resolve('clicked')
 * })
 *
 * const result = await promise // Waits for click
 *
 * // With timeout
 * const [timeoutPromise, timeoutResolve] = deferred()
 * setTimeout(timeoutResolve, 1000)
 * await timeoutPromise // Resolves after 1 second
 * ```
 *
 * @template T - Type of the resolved value (defaults to void)
 * @returns Tuple of [promise, resolve function, reject function]
 */
export default function deferred<T = void>(): [
    Promise<T>,
    (value: T | PromiseLike<T>) => void,
    (reason?: unknown) => void,
] {
    let resolve!: (value: T | PromiseLike<T>) => void
    let reject!: (reason?: unknown) => void

    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })

    return [promise, resolve, reject] as const
}
