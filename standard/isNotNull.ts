import globalify from 'sky/utilities/globalify'

declare global {
    function isNotNull<T>(value: T): T
}

namespace module {
    export function isNotNull<T>(value: T): T {
        if (value == null) {
            throw Error('null')
        }

        return value
    }
}

globalify(module)
