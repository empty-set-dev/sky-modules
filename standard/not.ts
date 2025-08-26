import globalify from 'sky/utilities/globalify'

declare global {
    const notUndefined: typeof lib.notUndefined
    const notNull: typeof lib.notNull
    const notNullish: typeof lib.notNullish
}

namespace lib {
    export class UndefinedError extends Error {
        constructor() {
            super('unexpected undefined')
        }
    }
    export function notUndefined<T>(value: undefined | T): T {
        if (value === undefined) {
            throw new UndefinedError()
        }

        return value
    }
    export class NullError extends Error {
        constructor() {
            super('unexpected null')
        }
    }
    export function notNull<T>(value: null | T): T {
        if (value === null) {
            throw new NullError()
        }

        return value
    }
    export class NullishError extends Error {
        constructor() {
            super('unexpected nullish')
        }
    }
    export function notNullish<T>(value: undefined | null | T): T {
        if (value == null) {
            throw new NullishError()
        }

        return value
    }
}

globalify(lib)
