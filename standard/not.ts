import globalify from 'sky/utilities/globalify'

declare global {
    const notUndefined: typeof lib.notUndefined
    const notNull: typeof lib.notNull
    const notNullish: typeof lib.notNullish
}

namespace lib {
    export function notUndefined<T>(value: undefined | T): T {
        if (value === undefined) {
            throw Error('undefined')
        }

        return value
    }
    export function notNull<T>(value: null | T): T {
        if (value === null) {
            throw Error('null')
        }

        return value
    }
    export function notNullish<T>(value: undefined | null | T): T {
        if (value == null) {
            throw Error('nullish')
        }

        return value
    }
}

globalify(lib)
