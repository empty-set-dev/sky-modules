import { DANGEROUS_KEYS } from '../errors/constants'
import { InvalidScopeError, PrototypePollutionError } from '../errors/security-errors'
import mergeNamespace from '../mergeNamespace'

interface Scope {
    [key: string]: unknown | Scope
}

function validateKey(key: string): void {
    if ((DANGEROUS_KEYS as readonly string[]).includes(key)) {
        throw new PrototypePollutionError(key)
    }
}

function canBecameScope(scope: unknown): scope is Scope {
    return (
        scope !== null &&
        (typeof scope === 'undefined' || typeof scope === 'object' || typeof scope === 'function')
    )
}

/**
 * Add module exports to the global scope
 *
 * Makes all exported members of a module available globally.
 * Useful for creating global utilities and extensions.
 *
 * @example
 * ```typescript
 * // Make all functions available globally
 * globalify({
 *   helper: () => 'help',
 *   utils: { format: (s) => s.toUpperCase() }
 * })
 *
 * // Now accessible globally
 * helper() // 'help'
 * utils.format('test') // 'TEST'
 * ```
 *
 * @param module - Object containing exports to globalize
 */
export default function globalify(module: Record<PropertyKey, unknown>): void {
    mergeNamespace(global, module)
}

/**
 * Add module exports to a namespaced global scope
 *
 * Creates or uses an existing namespace in the global scope and adds
 * the module exports to it. Prevents global scope pollution by organizing
 * globals under namespaces.
 *
 * @example
 * ```typescript
 * // Add to app.utils namespace
 * globalify.namespace('app.utils', {
 *   format: (s) => s.toUpperCase(),
 *   parse: (s) => s.toLowerCase()
 * })
 *
 * // Access via namespace
 * app.utils.format('test') // 'TEST'
 * app.utils.parse('TEST') // 'test'
 * ```
 *
 * @param ns - Dot-separated namespace path (e.g., 'app.utils')
 * @param module - Object containing exports to add to namespace
 * @throws {PrototypePollutionError} If namespace contains dangerous keys
 * @throws {InvalidScopeError} If namespace path is invalid
 */
globalify.namespace = function namespace(ns: string, module: Record<PropertyKey, unknown>): void {
    const parts = ns.split('.')
    let scope: Scope = global

    for (let i = 0; i < parts.length; i++) {
        const key = parts[i]

        // Validate key for prototype pollution
        validateKey(key)

        if (!canBecameScope(scope[key])) {
            throw new InvalidScopeError(ns)
        }

        scope[key] ??= {}
        scope = <Scope>scope[key]

        if (i === parts.length - 1) {
            mergeNamespace(scope, module)
        }
    }
}
