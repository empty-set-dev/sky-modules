import __reactivePropertyDescriptors from './__reactivePropertyDescriptors'

namespace local {
    export type Static = {
        [idSymbol]: number
        [typeSymbol]: string
    }
    export type Prototype = {
        __typeDescription: Record<string, unknown>
    }
    export const reactivePropertyDescriptors = __reactivePropertyDescriptors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Defines = Record<string | symbol, any>
    export const idSymbol = Symbol('id')
    export const typeSymbol = Symbol('type')
    export let uniqueId = 0
    export let staticMaxId: number
    export const loadedDefines: Record<string, number> = {}
    export const defines: Record<
        string,
        { name: string; value: { [idSymbol]: number; [typeSymbol]: string } }
    > = {}
    export const types: Record<string, new <T>(description: object, object: T) => T> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const descriptions: Record<string, any> = {}
    export let reactions: Function[] = []
}

export default local
