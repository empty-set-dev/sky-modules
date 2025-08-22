import globalify from 'sky/utilities/globalify'

declare global {
    function extends_type<T>(value: unknown): value is T
}

namespace lib {
    export function extends_type<T>(value: unknown): value is T {
        return true
    }
}

globalify(lib)
