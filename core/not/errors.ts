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
