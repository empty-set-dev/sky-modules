import __array from './__array'
import __makePlain from './__makePlain'
import __reactivePropertyDescriptors from './__reactivePropertyDescriptors'

namespace local {
    export const array = __array
    export interface Static {
        [idSymbol]: number
        [typeSymbol]: string
        [nameSymbol]: string
        [uidSymbol]: string
    }
    export const makePlain = __makePlain
    export const reactivePropertyDescriptors = __reactivePropertyDescriptors
    export type Defines = Record<string | symbol, number>
    export const constructorSymbol = Symbol('constructor')
    export const idSymbol = Symbol('id')
    export const typeSymbol = Symbol('type')
    export const nameSymbol = Symbol('name')
    export const uidSymbol = Symbol('uid')
    export let uniqueId = 2
    export let staticMaxId: number
    export const loadedDefines: Record<string, number> = {}
    export const defines: Record<string, { name: string; value: Static }> = {}
    export const schemas: Record<string, unknown> = {}
    export let reactions: Function[] = []
}

export default local
