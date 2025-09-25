import mergeNamespace from 'sky/core/mergeNamespace'

function globalify(module: Record<PropertyKey, unknown>): void {
    mergeNamespace(global, module)
}

;(global as any).define?.('sky.standard.globalify', globalify)

globalify.namespace = function namespace(ns: string, module: Record<PropertyKey, unknown>): void {
    const parts = ns.split('.')
    let scope: any = global
    for (let i = 0; i < parts.length; i++) {
        const key = parts[i]
        scope[key] ||= {}
        scope = scope[key]
        if (i === parts.length - 1) {
            ;(global as any).mergeNamespaces(scope, module)
        }
    }
}
;(global as any).define?.('sky.standard.globalify.namespace', globalify.namespace)

export default globalify
