import { observe as InternalObserve, unobserve as InternalUnobserve } from '../observe'
import { UpdateOfShared } from '../share'

import InternalReactiveArray from './internal.ReactiveArray'

namespace Internal {
    export const ReactiveArray = InternalReactiveArray

    export interface Static {
        [idSymbol]: number
        [typeSymbol]: string
        [nameSymbol]: string
        [uidSymbol]: string
    }

    export interface Shared {
        [Internal.idSymbol]: number
        [Internal.listenersOfSharedSymbol]: Map<UpdateOfSharedCallback, number>
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
    export type Defines = Record<PropertyKey, number>
    export const constructorSymbol = Symbol('constructor')
    export const idSymbol = Symbol('id')
    export const typeSymbol = Symbol('type')
    export const nameSymbol = Symbol('name')
    export const uidSymbol = Symbol('uid')
    export const listenersOfSharedSymbol = Symbol('listenersOfShared')
    export const propertyIndexSymbol = Symbol('propertyIndex')
    export let uniqueId = 1
    export let staticMaxId: number
    export const loadedDefines: Record<string, number> = {}
    export const defines: Record<string, { name: string; value: Static }> = {}
    export const schemas: Record<string, unknown> = {}
}
export default Internal
