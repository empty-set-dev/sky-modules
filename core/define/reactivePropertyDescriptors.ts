import assume from '../assume'
import { fire } from '../async'
import { NullError } from '../not/errors'
import switch_thread from '../switch_thread'

import { UnknownObjectError } from './errors'
import Internal from './Internal'
import { UpdateOfShared, UpdateOfSharedCallback } from './share'

function toPrimitive(
    value: UpdateOfShared.primitive | object | Function
): UpdateOfShared.primitive {
    if (typeof value === 'object' || typeof value === 'function') {
        assume<{ [Internal.idSymbol]?: number }>(value)

        if (value[Internal.idSymbol] == null) {
            throw new UnknownObjectError(typeof value === 'object' ? 'object' : 'function')
        }

        return (value as Internal.Shared)[Internal.idSymbol]
    }

    return value
}

function commit(callback: UpdateOfSharedCallback): void {
    const plainUpdates: UpdateOfShared = []
    const plainCreateUpdates = [UpdateOfShared.Type.CREATE, []] as UpdateOfShared.Create
    plainUpdates[0] = plainCreateUpdates
    const plainDestroyUpdates = [UpdateOfShared.Type.DESTROY, []] as UpdateOfShared.Destroy
    plainUpdates[1] = plainDestroyUpdates
    const plainSetUpdates = [UpdateOfShared.Type.SET, []] as UpdateOfShared.Set
    plainUpdates[2] = plainSetUpdates

    const prettyUpdates: UpdateOfShared.Pretty = {
        create: [],
        destroy: [],
        set: [],
    }

    callback.set.forEach((set, object) => {
        const prettySet = {} as Record<string, UpdateOfShared.primitive>
        const keys = Object.keys(object.constructor.schema)
        set.forEach((value, i) => {
            const key = keys[i]
            prettySet[key] = value
        })

        plainSetUpdates[1].push([
            object[Internal.idSymbol],
            set.reduce(
                (array, value, i): [number, UpdateOfShared.primitive][] => {
                    return array.concat([i, toPrimitive(value)])
                },
                [] as [number, UpdateOfShared.primitive][]
            ),
        ])
        prettyUpdates.set.push([
            object.constructor[Internal.uidSymbol],
            object[Internal.idSymbol],
            prettySet,
        ])
    })

    callback(plainUpdates, prettyUpdates)
}

function queueCommit(callback: UpdateOfSharedCallback): void {
    callback.isWaitingCommit = true

    fire(async () => {
        await switch_thread()

        commit(callback)
        callback.isWaitingCommit = false
    })
}

export default function reactivePropertyDescriptors<T extends object>(
    schema: T
): Record<string, PropertyDescriptor> {
    const propertiesMap: Record<PropertyKey, PropertyDescriptor> = {}

    const schemaKeys = Object.keys(schema)
    schemaKeys.map((k, i) => {
        interface This extends Internal.Reactive, Internal.Shared {
            [valueSymbol]: unknown
        }
        const property = schema[k as keyof T] as {
            [Internal.constructorSymbol]: new <T>(object: T) => T
        }
        const valueSymbol = `${k}_`

        if (typeof property === 'object') {
            property[Internal.constructorSymbol] ??= Internal.makePlain(property) as ReturnType<
                typeof Internal.makePlain
            > &
                (new (object: object) => object)
        }

        function get_primitive(this: This): unknown {
            return this[valueSymbol]
        }

        function set_primitive(this: This, value: unknown): void {
            if (this[Internal.listenersOfShared] != null) {
                const map = this[Internal.listenersOfShared]
                map.forEach((k, callback) => {
                    assume<UpdateOfSharedCallback>(callback)

                    callback.set ??= new Map()

                    if (callback.set.has(this)) {
                        const set = callback.set.get(this)
                        set[i] = value as UpdateOfShared.primitive
                    } else {
                        const set: UpdateOfShared.primitive[] = []
                        callback.set.set(this, set)
                        set[i] = value as UpdateOfShared.primitive
                    }

                    if (!callback.isWaitingCommit) {
                        queueCommit(callback)
                    }
                })
            }

            this[valueSymbol] = value
        }

        function set_array_or_object(this: This, object: object): void {
            if (!Array.isArray(object) && object.constructor.schema == null) {
                object = new property[Internal.constructorSymbol](object)
            }

            const previousObject = this[valueSymbol] as This

            if (this[Internal.listenersOfShared] != null) {
                if (previousObject != null) {
                    if (previousObject.constructor == null) {
                        throw new NullError('constructor is null')
                    }

                    Internal.unobserve(previousObject, previousObject.constructor.schema, [
                        ...this[Internal.listenersOfShared].keys(),
                    ])
                }

                if (object != null) {
                    Internal.observe(object, object.constructor.schema, [
                        ...this[Internal.listenersOfShared].keys(),
                    ])
                }
            }

            set_primitive.call(this, object)
        }

        if (property == null) {
            // Skip null properties - they're intentionally undefined
        } else if (Array.isArray(property)) {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_array_or_object,
                enumerable: true,
                configurable: true,
            }
        } else if (typeof property === 'object' || typeof property === 'function') {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_array_or_object,
                enumerable: true,
                configurable: true,
            }
        } else {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_primitive,
                enumerable: true,
                configurable: true,
            }
        }
    })

    return propertiesMap
}
