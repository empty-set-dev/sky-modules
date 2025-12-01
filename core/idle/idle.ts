/**
 * Parameters for idle function
 */
export interface IdleParameters {
    /** AbortSignal to cancel the idle timeout */
    signal?: AbortSignal
}

/**
 * Async delay/sleep function with abort support
 *
 * Waits for a specified time period before resolving. Supports cancellation
 * via AbortSignal. Uses Time type for duration (seconds).
 *
 * @example
 * ```typescript
 * // Simple delay
 * await idle(2.s) // Wait 2 seconds
 * await idle(500.ms) // Wait 500 milliseconds
 *
 * // With abort support
 * const controller = new AbortController()
 * const idlePromise = idle(10.s, { signal: controller.signal })
 *
 * // Cancel after 1 second
 * setTimeout(() => controller.abort(), 1000)
 * await idlePromise // Resolves early when aborted
 * ```
 *
 * @param timeout - Duration to wait (Time type in seconds)
 * @param parameters - Optional parameters including abort signal
 * @returns Promise that resolves after timeout or abort
 */
export default async function idle(timeout: Time, parameters?: IdleParameters): Promise<void> {
    return await new Promise(resolve => {
        const timeoutHandler = setTimeout(resolve, timeout.valueOf() * 1000)
        parameters?.signal?.addEventListener('abort', () => clearTimeout(timeoutHandler))
    })
}
