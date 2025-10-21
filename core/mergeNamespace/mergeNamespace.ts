import { DANGEROUS_KEYS } from '../errors/constants'
import { PrototypePollutionError } from '../errors/security-errors'

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
