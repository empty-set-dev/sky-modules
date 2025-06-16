import globalify from 'sky/utilities/globalify'

declare global {
    function isNotNull<T>(value: T): T
}

namespace lib {
    export function isNotNull<T>(value: T): T {
        if (value == null) {
            throw Error('null')
        }

        return value
    }
}

globalify(lib)
