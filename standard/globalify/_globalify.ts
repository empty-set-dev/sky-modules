type NestedNamespace = { [k: PropertyKey]: NestedNamespace }

declare const window: NestedNamespace
declare const global: NestedNamespace

define('sky.standard.globalify', globalify)
export default function globalify(module: Record<PropertyKey, unknown>): void {
    const globalScope = typeof global === 'undefined' ? window : global
    mergeNamespaces(globalScope, module)
}

define(
    'sky.standard.globalify.namespace',
    (globalify.namespace = function namespace(
        namespace: string,
        module: Record<string, unknown>
    ): void {
        const namespacesArray = namespace.split('.')
        let scope = typeof global === 'undefined' ? window : global
        namespacesArray.forEach((namespace, i) => {
            scope[namespace] ??= {}
            scope = scope[namespace]

            if (i === namespacesArray.length - 1) {
                mergeNamespaces(scope, module)
            }
        })
    })
)
