/**
 * Execute function and return result or undefined on error
 *
 * Wraps function execution in try-catch, returning undefined for any errors.
 * Useful for optional operations where failures should be silently ignored.
 *
 * @example
 * ```typescript
 * // Parse JSON or return undefined
 * const data = await justTry(() => JSON.parse(userInput))
 * if (data) {
 *   console.log('Valid JSON:', data)
 * }
 *
 * // Async operations
 * const result = await justTry(async () => {
 *   return await fetchData()
 * })
 *
 * // Optional file read
 * const config = await justTry(() => readConfigFile())
 * const finalConfig = config ?? defaultConfig
 * ```
 *
 * @template T - Return type of the function
 * @param fn - Function to execute (sync or async)
 * @returns Promise resolving to function result or undefined on error
 */
export default async function justTry<T>(fn: () => T): Promise<undefined | T> {
    try {
        return await fn()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return undefined
    }
}
