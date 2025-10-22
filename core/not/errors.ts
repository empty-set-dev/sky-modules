// Custom error classes without define decorators to avoid circular dependencies

import define from '../define/define'

define('sky.core.UndefinedError', UndefinedError)
export class UndefinedError extends Error {
    constructor(message: string) {
        super(`unexpected undefined: ${message}`)
        this.name = 'UndefinedError'
    }
}

define('sky.core.NullError', NullError)
export class NullError extends Error {
    constructor(message: string) {
        super(`unexpected null: ${message}`)
        this.name = 'NullError'
    }
}

define('sky.core.NullishError', NullishError)
export class NullishError extends Error {
    constructor(message: string) {
        super(`unexpected nullish: ${message}`)
        this.name = 'NullishError'
    }
}
