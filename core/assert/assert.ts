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
