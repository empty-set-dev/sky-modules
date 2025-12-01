/**
 * Repeat an async or sync operation a specified number of times
 *
 * Executes callback sequentially for each iteration. Supports both
 * synchronous and asynchronous callbacks, awaiting promises when needed.
 *
 * @example
 * ```typescript
 * // Simple repeat
 * await repeat(5, (i) => {
 *   console.log(`Iteration ${i}`)
 * })
 *
 * // Async operations
 * await repeat(3, async (i) => {
 *   await saveToDatabase({ attempt: i })
 * })
 *
 * // With arguments
 * await repeat(10, async (i, prefix, suffix) => {
 *   console.log(`${prefix} ${i} ${suffix}`)
 * }, 'Count:', '!')
 * // Logs: "Count: 0 !", "Count: 1 !", ...
 * ```
 *
 * @template A - Additional argument types
 * @param count - Number of times to repeat
 * @param callback - Function to execute each iteration (receives iteration number and args)
 * @param args - Additional arguments passed to callback
 * @returns Promise resolving when all iterations complete
 */
export default async function repeat<A extends unknown[]>(
    count: number,
    callback: (iteration: number, ...args: A) => void,
    ...args: A
): Promise<void> {
    for (let i = 0; i < count; ++i) {
        const result = callback(i, ...args) as void | Promise<void>

        if (result instanceof Promise) {
            await result
        }
    }
}
