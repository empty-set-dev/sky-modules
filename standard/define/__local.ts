import __array from './__array'
import __makePlain from './__makePlain'
import { observe as __observe, unobserve as __unobserve } from './__observe'
import __reactivePropertyDescriptors from './__reactivePropertyDescriptors'

namespace local {
    export const array = __array
    export function extends_type<T>(value: unknown): asserts value is T {
        //
    }

    export interface Static {
        [idSymbol]: number
        [typeSymbol]: string
        [nameSymbol]: string
        [uidSymbol]: string
    }
    export interface Reactive {
        [listenersOfReactivitySymbol]: Set<unknown>
    }
    export interface Shared {
        [local.idSymbol]: number
        [local.listenersOfShared]: Map<UpdateOfSharedCallback, number>
        constructor: (new () => void) & {
            [local.idSymbol]: number
            [local.nameSymbol]: string
            [local.uidSymbol]: string
        }
    }
    export interface UpdateOfSharedCallback {
        (update: UpdateOfShared, prettyUpdate: UpdateOfShared.Pretty): void
        create: Map<Shared, object>
        set: Map<Shared, UpdateOfShared.primitive[]>
        delete: Set<Shared>
        isWaitCommit: boolean
    }
    export const makePlain = __makePlain
    export const observe = __observe
    export const unobserve = __unobserve
    export const reactivePropertyDescriptors = __reactivePropertyDescriptors
    export type Defines = Record<string | symbol, number>
    export const constructorSymbol = Symbol('constructor')
    export const idSymbol = Symbol('id')
    export const typeSymbol = Symbol('type')
    export const nameSymbol = Symbol('name')
    export const uidSymbol = Symbol('uid')
    export const listenersOfReactivitySymbol = Symbol('listenersOfReactivity')
    export const listenersOfShared = Symbol('listenersOfShared')
    export let uniqueId = 2
    export let staticMaxId: number
    export const loadedDefines: Record<string, number> = {}
    export const defines: Record<string, { name: string; value: Static }> = {}
    export const schemas: Record<string, unknown> = {}
    export let reactions: Function[] = []
}

export default local
