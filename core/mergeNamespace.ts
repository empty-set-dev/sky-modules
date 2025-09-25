export default function mergeNamespaces(
    targetNamespace: Record<string, unknown>,
    namespace: Record<string, unknown>
): void {
    Object.keys(namespace).forEach(k => {
        if (
            targetNamespace[k] != null &&
            typeof targetNamespace[k] === 'function' &&
            typeof namespace[k] === 'object' &&
            !Array.isArray(namespace)
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
