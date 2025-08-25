import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    type UpdateOfShared = (
        | UpdateOfShared.Create
        | UpdateOfShared.Destroy
        | UpdateOfShared.Set
        | UpdateOfShared.Call
    )[]
    namespace UpdateOfShared {
        type primitive = null | boolean | number | bigint | string
        interface Pretty {
            create: PrettyCreate
            destroy: PrettyDestroy
            set: PrettySet
            call?: PrettyCall
        }
        type PrettyType = 'create' | 'destroy' | 'set' | 'call'
        type PrettyCreate = [Class: string, id: number, properties: Record<string, primitive>][]
        type PrettyDestroy = [Class: string, id: number][]
        type PrettySet = [Class: string, id: number, properties: Record<string, primitive>][]
        type PrettyCall = [function: string, ...args: primitive[]]

        enum Type {
            CREATE = 1,
            DESTROY = 2,
            SET = 3,
            CALL = 4,
        }
        type Create = [
            type: UpdateOfShared.Type.CREATE,
            [ClassID: number, id: number, properties: primitive[]][],
        ]
        type Destroy = [type: UpdateOfShared.Type.DESTROY, number[]]
        type Set = [UpdateOfShared.Type.SET, [id: number, properties: [number, primitive][]][]]
        type Call = [
            UpdateOfShared.Type.CALL,
            id: number,
            this: undefined | object,
            arguments: primitive[],
        ]
    }
    type UpdateOfSharedCallback = lib.UpdateOfSharedCallback
    type share = typeof lib.share
    const share: typeof lib.share
    type unshare = typeof lib.unshare
    const unshare: typeof lib.unshare
}

namespace UpdateOfSharedLib {
    export enum Type {
        CREATE = 1,
        DESTROY = 2,
        SET = 3,
        CALL = 4,
    }
}

globalify.namespace('UpdateOfShared', UpdateOfSharedLib)

namespace lib {
    export type UpdateOfSharedCallback = (
        update: UpdateOfShared,
        prettyUpdate: UpdateOfShared.Pretty
    ) => void

    define('sky.standard.share', share)
    export function share(target: Object, callback: UpdateOfSharedCallback): void {
        if (!isRuntime) {
            throw Error('sharing not in runtime')
        }

        if (!extends_type<local.Shared>(target)) {
            return null!
        }

        if (target.constructor[local.idSymbol] == null) {
            throw Error('share object with unknown schema or class')
        }

        local.observe(target, target.constructor.schema, [callback])
    }

    define('sky.standard.unshare', unshare)
    export function unshare(target: Object, callback: UpdateOfSharedCallback): void {
        if (!extends_type<local.Shared>(target)) {
            return null!
        }

        if (target.constructor[local.idSymbol] == null) {
            throw Error('unshare object with unknown class')
        }

        local.unobserve(target, target.constructor.schema, [callback])
    }
}

globalify(lib)
