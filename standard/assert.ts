import globalify from 'sky/standard/globalify'

declare global {
    class AssertionError extends lib.AssertionError {}
    function assert(expression: unknown, message?: string | Error): void
}

namespace lib {
    export class AssertionError extends Error {
        constructor(error?: string | Error) {
            super('assertion failed', { cause: error })
        }
    }

    export function assert(expression: unknown, message?: string | Error): void
    export function assert(expression: unknown, error?: Error): void
    export function assert(expression: unknown, arg1?: string | Error): void {
        if (!expression) {
            throw new AssertionError(arg1)
        }
    }
}

throw AssertionError('')

globalify(lib)
