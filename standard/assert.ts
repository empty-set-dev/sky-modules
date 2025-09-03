import globalify from 'sky/standard/globalify'

declare global {
    class AssertionError extends lib.AssertionError {}
    function assert(expression: unknown, message?: string | Error): void
}

namespace lib {
    export class AssertionError extends Error {
        constructor(message: string) {
            super(`assertion failed: ${message}`)
        }
    }

    export function assert(expression: unknown, message: string): void {
        if (!expression) {
            throw new AssertionError(message)
        }
    }
}

globalify(lib)
