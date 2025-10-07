export default function mergeNamespace(targetNamespace, namespace) {
    Object.keys(namespace).forEach(k => {
        if (targetNamespace[k] != null &&
            typeof targetNamespace[k] === 'function' &&
            typeof namespace[k] === 'object' &&
            !Array.isArray(namespace[k])) {
            Object.assign(targetNamespace[k], namespace[k]);
        }
        else if (targetNamespace[k] != null &&
            typeof targetNamespace[k] === 'object' &&
            typeof namespace[k] === 'function' &&
            !Array.isArray(targetNamespace[k])) {
            Object.assign(namespace[k], targetNamespace[k]);
            targetNamespace[k] = namespace[k];
        }
        else {
            targetNamespace[k] = namespace[k];
        }
    });
}
//# sourceMappingURL=mergeNamespace.js.map