import globalify from 'sky/standard/globalify'

declare global {
    const UndefinedError: typeof lib.UndefinedError
    const notUndefined: typeof lib.notUndefined
    const NullError: typeof lib.NullError
    const notNull: typeof lib.notNull
    const NullishError: typeof lib.NullishError
    const notNullish: typeof lib.notNullish
}

namespace lib {
    @define('sky.standard.UndefinedError')
    export class UndefinedError extends Error {
        constructor(message: string) {
            super(`unexpected undefined: ${message}`)
        }
    }
    define('sky.standard.notUndefined', notUndefined)
    export function notUndefined<T>(value: undefined | T, message: string): T {
        if (value === undefined) {
            throw new UndefinedError(message)
        }

        return value
    }
    @define('sky.standard.NullError')
    export class NullError extends Error {
        constructor(message: string) {
            super(`unexpected null: ${message}`)
        }
    }
    define('sky.standard.notNull', notNull)
    export function notNull<T>(value: null | T, message: string): T {
        if (value === null) {
            throw new NullError(message)
        }

        return value
    }
    @define('sky.standard.NullishError')
    export class NullishError extends Error {
        constructor(message: string) {
            super(`unexpected nullish: ${message}`)
        }
    }
    define('sky.standard.notNullish', notNullish)
    export function notNullish<T>(value: undefined | null | T, message: string): T {
        if (value == null) {
            throw new NullishError(message)
        }

        return value
    }
}

globalify(lib)
