import assume from '../assume'

import define from './define'
import { RuntimeSharingError, UnknownSchemaError } from './errors'
import Internal from './Internal'

export namespace UpdateOfShared {
    export type primitive = null | boolean | number | bigint | string

    export interface Pretty {
        create: PrettyCreate
        destroy: PrettyDestroy
        set: PrettySet
        call?: PrettyCall
    }
    export type PrettyType = 'create' | 'destroy' | 'set' | 'call'
    export type PrettyCreate = [Class: string, id: number, properties: Record<string, primitive>][]
    export type PrettyDestroy = [Class: string, id: number][]
    export type PrettySet = [Class: string, id: number, properties: Record<string, primitive>][]
    export type PrettyCall = [function: string, ...args: primitive[]]

    export enum Type {
        CREATE = 1,
        DESTROY = 2,
        SET = 3,
        CALL = 4,
    }
    export type Create = [
        type: UpdateOfShared.Type.CREATE,
        [ClassID: number, id: number, properties: primitive[]][],
    ]
    export type Destroy = [type: UpdateOfShared.Type.DESTROY, number[]]
    export type Set = [UpdateOfShared.Type.SET, [id: number, properties: [number, primitive][]][]]
    export type Call = [
        UpdateOfShared.Type.CALL,
        id: number,
        this: undefined | object,
        arguments: primitive[],
    ]
}

export type UpdateOfShared = (
    | UpdateOfShared.Create
    | UpdateOfShared.Destroy
    | UpdateOfShared.Set
    | UpdateOfShared.Call
)[]

export type UpdateOfSharedCallback = (
    update: UpdateOfShared,
    prettyUpdate: UpdateOfShared.Pretty
) => void

export function share(target: Object, callback: UpdateOfSharedCallback): void {
    if (!isRuntime) {
        throw new RuntimeSharingError()
    }

    assume<Internal.Shared>(target)

    if (target.constructor[Internal.idSymbol] == null) {
        throw new UnknownSchemaError()
    }

    Internal.observe(target, target.constructor.schema, [callback])
}

export function unshare(target: Object, callback: UpdateOfSharedCallback): void {
    assume<Internal.Shared>(target)

    if (target.constructor[Internal.idSymbol] == null) {
        throw new UnknownSchemaError()
    }

    Internal.unobserve(target, target.constructor.schema, [callback])
}

define('sky.core.share', share)
define('sky.core.unshare', unshare)
