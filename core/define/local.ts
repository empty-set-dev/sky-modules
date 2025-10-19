import internalArray from './array'
import internalMakePlain from './makePlain'
import { observe as internalObserve, unobserve as internalUnobserve } from './observe'
import internalReactivePropertyDescriptors from './reactivePropertyDescriptors'

namespace local {
    export const array = internalArray

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
        isWaitingCommit: boolean
    }
    export const makePlain = internalMakePlain
    export const observe = internalObserve
    export const unobserve = internalUnobserve
    export const reactivePropertyDescriptors = internalReactivePropertyDescriptors
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

    export const currentDefinesSymbol = Symbol('sky.standard.define.#currentDefines')

    export const isHot = isRuntime && Object.keys(local.defines).length === 0
}
export default local
