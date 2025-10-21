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

/**
 * Errors related to observe/unobserve operations
 */
export class ObserveError extends DefineError {}

/**
 * Thrown when trying to unobserve object with no listeners
 */
export class NoListenersError extends ObserveError {
    constructor() {
        super('Cannot unobserve: object has no listeners')
    }
}

/**
 * Thrown when callback not found in listeners
 */
export class CallbackNotFoundError extends ObserveError {
    constructor() {
        super('Callback not found in listeners')
    }
}

/**
 * Thrown when trying to share/unshare at runtime incorrectly
 */
export class RuntimeSharingError extends DefineError {
    constructor() {
        super('Sharing not allowed in runtime mode')
    }
}

/**
 * Thrown when object type is unknown
 */
export class UnknownObjectError extends DefineError {
    constructor(type: 'object' | 'function') {
        super(`Unknown ${type}`)
    }
}

/**
 * Thrown when trying to make plain from unknown schema
 */
export class UnknownSchemaError extends DefineError {
    constructor() {
        super('Cannot create plain object from unknown schema')
    }
}
