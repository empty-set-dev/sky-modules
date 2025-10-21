import '@sky-modules/core/runtime'
import InternalArray from './array'
import InternalMakePlain from './makePlain'
import { observe as InternalObserve, unobserve as InternalUnobserve } from './observe'
import InternalReactivePropertyDescriptors from './reactivePropertyDescriptors'

namespace Internal {
    export const array = InternalArray

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
        [Internal.idSymbol]: number
        [Internal.listenersOfShared]: Map<UpdateOfSharedCallback, number>
        constructor: (new () => void) & {
            [Internal.idSymbol]: number
            [Internal.nameSymbol]: string
            [Internal.uidSymbol]: string
        }
    }
    export interface UpdateOfSharedCallback {
        (update: UpdateOfShared, prettyUpdate: UpdateOfShared.Pretty): void
        create: Map<Shared, object>
        set: Map<Shared, UpdateOfShared.primitive[]>
        delete: Set<Shared>
        isWaitingCommit: boolean
    }
    export const makePlain = InternalMakePlain
    export const observe = InternalObserve
    export const unobserve = InternalUnobserve
    export const reactivePropertyDescriptors = InternalReactivePropertyDescriptors
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

    export const isHot = isRuntime && Object.keys(Internal.defines).length === 0
}
export default Internal
