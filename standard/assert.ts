import globalify from 'sky/utilities/globalify'

declare global {
    class AssertionError extends lib.AssertionError {}
    function assert(expression: boolean): void
}

namespace lib {
    export class AssertionError extends Error {
        constructor() {
            super('assertion failed')
        }
    }

    export function assert(expression: boolean): void {
        if (!expression) {
            throw new AssertionError()
        }
    }
}

globalify(lib)
