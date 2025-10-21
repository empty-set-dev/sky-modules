import define from '../define'

// Custom error classes with message support
@define('sky.core.UndefinedError')
export class UndefinedError extends Error {
    constructor(message: string) {
        super(`unexpected undefined: ${message}`)
        this.name = 'UndefinedError'
    }
}

@define('sky.core.NullError')
export class NullError extends Error {
    constructor(message: string) {
        super(`unexpected null: ${message}`)
        this.name = 'NullError'
    }
}

@define('sky.core.NullishError')
export class NullishError extends Error {
    constructor(message: string) {
        super(`unexpected nullish: ${message}`)
        this.name = 'NullishError'
    }
}

define('sky.core.notUndefined', notUndefined)
export function notUndefined<T>(value: undefined | T, message: string): T {
    if (value === undefined) {
        throw new UndefinedError(message)
    }

    return value
}

define('sky.core.assertIsNotUndefined', assertIsNotUndefined)
export function assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T {
    if (value === undefined) {
        throw new UndefinedError(message)
    }
}

define('sky.core.notNull', notNull)
export function notNull<T>(value: null | T, message: string): T {
    if (value === null) {
        throw new NullError(message)
    }

    return value
}

define('sky.core.assertIsNotNull', assertIsNotNull)
export function assertIsNotNull<T>(value: null | T, message: string): asserts value is T {
    if (value === null) {
        throw new NullError(message)
    }
}

define('sky.core.notNullish', notNullish)
export function notNullish<T>(value: undefined | null | T, message: string): T {
    if (value == null) {
        throw new NullishError(message)
    }

    return value
}

define('sky.core.assertIsNotNullish', assertIsNotNullish)
export function assertIsNotNullish<T>(
    value: undefined | null | T,
    message: string
): asserts value is T {
    if (value == null) {
        throw new NullishError(message)
    }
}
