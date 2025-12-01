import define from '../define/define'

import { NullError, NullishError, UndefinedError } from './errors'

define('sky.core.notUndefined', notUndefined)
/**
 * Assert value is not undefined and return it
 *
 * @example
 * ```typescript
 * const value = maybeValue()
 * const definedValue = notUndefined(value, 'Value must be defined')
 * // Type: T (undefined stripped)
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if undefined
 * @returns The value (guaranteed not undefined)
 * @throws {UndefinedError} If value is undefined
 */
export function notUndefined<T>(value: undefined | T, message: string): T {
    if (value === undefined) {
        throw new UndefinedError(message)
    }

    return value
}

define('sky.core.assertIsNotUndefined', assertIsNotUndefined)
/**
 * Type guard asserting value is not undefined
 *
 * @example
 * ```typescript
 * function process(value: string | undefined) {
 *   assertIsNotUndefined(value, 'Value required')
 *   console.log(value.toUpperCase()) // TypeScript knows value is string
 * }
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if undefined
 * @throws {UndefinedError} If value is undefined
 */
export function assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T {
    if (value === undefined) {
        throw new UndefinedError(message)
    }
}

define('sky.core.notNull', notNull)
/**
 * Assert value is not null and return it
 *
 * @example
 * ```typescript
 * const element = document.querySelector('.button')
 * const button = notNull(element, 'Button not found')
 * // Type: Element (null stripped)
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if null
 * @returns The value (guaranteed not null)
 * @throws {NullError} If value is null
 */
export function notNull<T>(value: null | T, message: string): T {
    if (value === null) {
        throw new NullError(message)
    }

    return value
}

define('sky.core.assertIsNotNull', assertIsNotNull)
/**
 * Type guard asserting value is not null
 *
 * @example
 * ```typescript
 * function process(value: string | null) {
 *   assertIsNotNull(value, 'Value required')
 *   console.log(value.length) // TypeScript knows value is string
 * }
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if null
 * @throws {NullError} If value is null
 */
export function assertIsNotNull<T>(value: null | T, message: string): asserts value is T {
    if (value === null) {
        throw new NullError(message)
    }
}

define('sky.core.notNullish', notNullish)
/**
 * Assert value is not null or undefined and return it
 *
 * @example
 * ```typescript
 * const config = getConfig()
 * const validConfig = notNullish(config, 'Config required')
 * // Type: Config (null and undefined stripped)
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if nullish
 * @returns The value (guaranteed not null or undefined)
 * @throws {NullishError} If value is null or undefined
 */
export function notNullish<T>(value: undefined | null | T, message: string): T {
    if (value == null) {
        throw new NullishError(message)
    }

    return value
}

define('sky.core.assertIsNotNullish', assertIsNotNullish)
/**
 * Type guard asserting value is not null or undefined
 *
 * @example
 * ```typescript
 * function process(value: string | null | undefined) {
 *   assertIsNotNullish(value, 'Value required')
 *   console.log(value.trim()) // TypeScript knows value is string
 * }
 * ```
 *
 * @template T - Value type
 * @param value - Value to check
 * @param message - Error message if nullish
 * @throws {NullishError} If value is null or undefined
 */
export function assertIsNotNullish<T>(
    value: undefined | null | T,
    message: string
): asserts value is T {
    if (value == null) {
        throw new NullishError(message)
    }
}
