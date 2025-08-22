import globalify from 'sky/utilities/globalify'

declare global {
    function extendsType<T>(value: unknown): value is T
}

namespace lib {
    export function extendsType<T>(value: unknown): value is T {
        return true
    }
}

globalify(lib)
