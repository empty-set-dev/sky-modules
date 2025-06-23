import globalify from 'sky/utilities/globalify'

declare global {
    class NullError extends lib.NullError {}
    function isNull<T>(value: undefined | null | T): value is undefined | null
}

namespace lib {
    export class NullError extends Error {
        constructor() {
            super('null')
        }
    }
    export function isNull<T>(value: undefined | null | T): value is undefined | null {
        if (value == null) {
            return true
        }

        return false
    }
}

globalify(lib)
