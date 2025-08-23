namespace local {
    export const idSymbol = Symbol('id')
    export const idType = Symbol('type')
    export let uniqueId = 1000
    export const defines: Record<
        string,
        { name: string; value: { [idSymbol]: number; [idType]: string } }
    > = {}
    export const types: Record<string, PropertyDescriptorMap> = {}
}

export default local
