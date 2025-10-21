/**
 * Errors related to security violations
 */
export class SecurityError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

/**
 * Thrown when prototype pollution is attempted
 */
export class PrototypePollutionError extends SecurityError {
    constructor(key: string) {
        super(`Prototype pollution attempt detected: "${key}"`)
    }
}

/**
 * Thrown when trying to overwrite a protected global
 */
export class GlobalOverwriteError extends SecurityError {
    constructor(key: string) {
        super(`Attempt to overwrite protected global: "${key}"`)
    }
}
