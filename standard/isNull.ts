import globalify from 'sky/utilities/globalify'

declare global {
    function isNull<T>(value: undefined | null | T): value is undefined | null
}

namespace lib {
    export class NullError extends Error {}
    export function isNull<T>(value: undefined | null | T): value is undefined | null {
        if (value == null) {
            throw new NullError('null')
        }

        return false
    }
}

globalify(lib)
