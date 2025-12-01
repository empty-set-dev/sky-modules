import { DANGEROUS_KEYS } from '../errors/constants'
import { PrototypePollutionError } from '../errors/security-errors'

/**
 * Merge namespace objects with smart property handling
 *
 * Merges properties from source namespace into target namespace with:
 * - Prototype pollution protection
 * - Smart merging of functions and objects
 * - Preservation of existing functionality
 *
 * Used internally by globalify to safely merge module exports.
 *
 * @example
 * ```typescript
 * const target = {
 *   utils: { format: (x) => x }
 * }
 *
 * const source = {
 *   utils: { parse: (x) => x },
 *   helper: () => 'help'
 * }
 *
 * mergeNamespace(target, source)
 * // target.utils now has both format and parse
 * // target.helper is the helper function
 * ```
 *
 * @param targetNamespace - Target namespace to merge into
 * @param namespace - Source namespace to merge from
 * @throws {PrototypePollutionError} If source contains dangerous keys
 */
export default function mergeNamespace(
    targetNamespace: Record<string, unknown>,
    namespace: Record<string, unknown>
): void {
    Object.keys(namespace).forEach(k => {
        // Validate key for prototype pollution
        if ((DANGEROUS_KEYS as readonly string[]).includes(k)) {
            throw new PrototypePollutionError(k)
        }

        if (
            targetNamespace[k] != null &&
            typeof targetNamespace[k] === 'function' &&
            typeof namespace[k] === 'object' &&
            !Array.isArray(namespace[k])
        ) {
            Object.assign(targetNamespace[k], namespace[k])
        } else if (
            targetNamespace[k] != null &&
            typeof targetNamespace[k] === 'object' &&
            typeof namespace[k] === 'function' &&
            !Array.isArray(targetNamespace[k])
        ) {
            Object.assign(namespace[k], targetNamespace[k])
            targetNamespace[k] = namespace[k]
        } else {
            targetNamespace[k] = namespace[k]
        }
    })
}
