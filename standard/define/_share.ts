import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    type share = typeof lib.share
    const share: typeof lib.share
}

namespace lib {
    export namespace Update {
        export enum Type {
            CREATE = 1,
            DESTROY = 2,
            SET = 3,
            DELETE = 4,
            CALL = 5,
        }
        export type Create = [
            type: Update.Type.CREATE,
            [ClassID: number, id: number, properties: Record<number, unknown>][],
        ]
        export type Destroy = [type: Update.Type.DESTROY, [id: number][]]
        export type Set = [Update.Type.SET, [id: number, properties: Record<number, unknown>][]]
        export type Delete = [Update.Type.DELETE, [id: number, properties: string[]][]]
        export type Call = [Update.Type.CALL, id: number, this: unknown, arguments: unknown[]]
    }

    export type Update = [Update.Create | Update.Destroy | Update.Set | Update.Delete | Update.Call]

    define('sky.standard.share', share)
    export function share(target: Object, callback: (update: Update) => void): void {
        if (!extends_type<{ constructor?: { [local.idSymbol]: number } }>(target)) {
            return null!
        }

        if (target.constructor == null) {
            throw Error('share unknown object')
        }

        if (target.constructor[local.idSymbol] == null) {
            throw Error('share unknown class')
        }

        observe(target, target.constructor.schema, callback)

        console.log('observed', target)
    }

    function observe(
        target: Object,
        schema: Record<PropertyKey, unknown>,
        callback: (update: Update) => void
    ): void {
        if (!extends_type<{ [local.idSymbol]: number }>(target)) {
            return null!
        }

        if (target[local.idSymbol] == null) {
            target[local.idSymbol] = ++local.uniqueId
        }

        Object.keys(schema).forEach(k => {
            const property = schema[k] as Record<PropertyKey, unknown>

            if (Array.isArray(property)) {
                observe(target[k as keyof Object], property, callback)
            } else if (typeof property === 'object') {
                observe(target[k as keyof Object], property, callback)
            }
        })
    }
}

globalify(lib)
