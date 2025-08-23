namespace local {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Defines = Record<string | symbol, any>
    export const idSymbol = Symbol('id')
    export const typeSymbol = Symbol('type')
    export let uniqueId = 0
    export const loadedDefines: Record<string, number> = {}
    export const defines: Record<
        string,
        { name: string; value: { [idSymbol]: number; [typeSymbol]: string } }
    > = {}
    export const types: Record<string, PropertyDescriptorMap> = {}
}

export default local
