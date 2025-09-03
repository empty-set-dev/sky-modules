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
    export class UndefinedError extends Error {
        constructor(message: string) {
            super(`unexpected undefined: ${message}`)
        }
    }
    export function notUndefined<T>(value: undefined | T, message: string): T {
        if (value === undefined) {
            throw new UndefinedError(message)
        }

        return value
    }
    export class NullError extends Error {
        constructor(message: string) {
            super(`unexpected null: ${message}`)
        }
    }
    export function notNull<T>(value: null | T, message: string): T {
        if (value === null) {
            throw new NullError(message)
        }

        return value
    }
    export class NullishError extends Error {
        constructor(message: string) {
            super(`unexpected nullish: ${message}`)
        }
    }
    export function notNullish<T>(value: undefined | null | T, message: string): T {
        if (value == null) {
            throw new NullishError(message)
        }

        return value
    }
}

globalify(lib)
