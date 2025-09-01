import globalify from 'sky/standard/globalify'

declare global {
    class AssertionError extends lib.AssertionError {}
    function assert(expression: unknown): void
}

namespace lib {
    export class AssertionError extends Error {
        constructor() {
            super('assertion failed')
        }
    }

    export function assert(expression: unknown): void {
        if (!expression) {
            throw new AssertionError()
        }
    }
}

globalify(lib)
