type NestedNamespace = { [k: PropertyKey]: NestedNamespace }

declare const global: NestedNamespace

define('sky.standard.globalify', globalify)
export default function globalify(module: Record<PropertyKey, unknown>): void {
    mergeNamespaces(global, module)
}

define(
    'sky.standard.globalify.namespace',
    (globalify.namespace = function namespace(
        namespace: string,
        module: Record<string, unknown>
    ): void {
        const namespacesArray = namespace.split('.')
        let scope = global

        for (const [i, namespace] of namespacesArray.entries()) {
            scope[namespace] ??= {}
            scope = scope[namespace]

            if (i === namespacesArray.length - 1) {
                mergeNamespaces(scope, module)
            }
        }
    })
)
