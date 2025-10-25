import '../runtime'
import { observe as InternalObserve, unobserve as InternalUnobserve } from '../reactive/observe'
import { UpdateOfShared } from '../reactive/share'

import InternalArray from './array'

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
    export const observe = InternalObserve
    export const unobserve = InternalUnobserve
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

    export const currentDefinesSymbol = Symbol('currentDefines')
}
export default Internal
