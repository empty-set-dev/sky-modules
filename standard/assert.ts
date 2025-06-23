import globalify from 'sky/utilities/globalify'

declare global {
    const assertion_failed: Error
    function assert(expression: boolean): void
}

namespace lib {
    export const assertion_failed = Error('assertion failed')

    export function assert(expression: boolean): void {
        if (!expression) {
            throw assertion_failed
        }
    }
}

globalify(lib)
