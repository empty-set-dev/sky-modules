/**
 * Error thrown when an assertion fails
 */
export class AssertionError extends Error {
    constructor(message: string) {
        super(`assertion failed: ${message}`)
    }
}

/**
 * Assert that an expression is truthy
 *
 * Throws AssertionError if the expression is falsy. Similar to Node's assert
 * but with custom error type.
 *
 * @example
 * ```typescript
 * const value = getValue()
 * assert(value > 0, 'Value must be positive')
 * assert(Array.isArray(data), 'Data must be an array')
 *
 * // Type narrowing with type predicates
 * function isString(value: unknown): asserts value is string {
 *   assert(typeof value === 'string', 'Value must be string')
 * }
 * ```
 *
 * @param expression - Expression to check
 * @param message - Error message if assertion fails
 * @throws {AssertionError} If expression is falsy
 */
export function assert(expression: unknown, message: string): void {
    if (!expression) {
        throw new AssertionError(message)
    }
}
