import globalify from 'sky/utilities/globalify'

declare global {
    function is<T>(value: unknown): value is T
}

namespace lib {
    export function is<T>(value: unknown): value is T {
        return true
    }
}

globalify(lib)
