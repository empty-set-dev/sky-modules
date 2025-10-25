export class UndefinedError extends Error {
    constructor(message: string) {
        super(`unexpected undefined: ${message}`)
        this.name = 'UndefinedError'
    }
}

export class NullError extends Error {
    constructor(message: string) {
        super(`unexpected null: ${message}`)
        this.name = 'NullError'
    }
}

export class NullishError extends Error {
    constructor(message: string) {
        super(`unexpected nullish: ${message}`)
        this.name = 'NullishError'
    }
}

// Defer define calls to avoid circular dependency
import runStaticCode from '#/runtime/runStaticCode'

runStaticCode(async () => {
    const { default: define } = await import('../define/define')
    define('sky.core.UndefinedError', UndefinedError)
    define('sky.core.NullError', NullError)
    define('sky.core.NullishError', NullishError)
})
