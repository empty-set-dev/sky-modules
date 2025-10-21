/**
 * Errors related to the define system
 */
export class DefineError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

/**
 * Thrown when attempting to register a duplicate define
 */
export class DuplicateDefineError extends DefineError {
    constructor(name: string) {
        super(`Duplicate define: ${name}`)
    }
}

/**
 * Thrown when define name format is invalid
 */
export class InvalidDefineNameError extends DefineError {
    constructor(name: string) {
        super(`Invalid define name: "${name}". Name must match /^[a-zA-Z][a-zA-Z0-9_.]*$/`)
    }
}

/**
 * Thrown when trying to define at runtime incorrectly
 */
export class RuntimeDefineError extends DefineError {
    constructor() {
        super('Cannot define at runtime. Only allowed during HMR.')
    }
}

/**
 * Errors related to validation
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

/**
 * Errors related to schema operations
 */
export class SchemaError extends ValidationError {}

/**
 * Thrown when schema is invalid
 */
export class InvalidSchemaError extends SchemaError {
    constructor(message: string) {
        super(`Invalid schema: ${message}`)
    }
}
