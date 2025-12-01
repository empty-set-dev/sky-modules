/**
 * Effect-based timeout utility
 *
 * Creates a timeout that automatically clears when its effect is disposed.
 * Uses Time type for duration with automatic millisecond conversion.
 *
 * @example Basic usage
 * ```typescript
 * new Timeout([effect], () => {
 *     console.log('Executed after 1 second')
 * }, (1).seconds)
 * ```
 *
 * @example With arguments
 * ```typescript
 * new Timeout([effect], (x, y) => {
 *     console.log(x + y)
 * }, (500).milliseconds, 10, 20)
 * ```
 */
export default class Timeout {
    readonly effect: Effect

    /**
     * Create timeout
     *
     * @param dep - Effect dependency
     * @param callback - Function to execute after timeout
     * @param timeout - Duration using Time type
     * @param args - Arguments to pass to callback
     */
    constructor(
        dep: EffectDep,
        callback: (...args: unknown[]) => void,
        timeout: Time,
        ...args: unknown[]
    ) {
        this.effect = new Effect(dep, this)

        const identifier = setTimeout(callback, timeout.inMilliseconds, ...args)

        this.effect.dispose = (): void => {
            clearTimeout(identifier)
        }
    }
}
