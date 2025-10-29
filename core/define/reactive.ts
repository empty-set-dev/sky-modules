import { createSignal } from 'solid-js/dist/solid.js'

import assume from '#/assume'
import { UnknownObjectError } from '#/define/errors'
import Internal from '#/define/internal/internal'

import { UpdateOfShared, UpdateOfSharedCallback } from './share.types'

function toPrimitive(
    value: UpdateOfShared.primitive | object | Function
): UpdateOfShared.primitive {
    if (typeof value === 'object' || typeof value === 'function') {
        assume<{ [Internal.idSymbol]?: number } & Internal.Shared>(value)

        if (value[Internal.idSymbol] == null) {
            throw new UnknownObjectError(typeof value === 'object' ? 'object' : 'function')
        }

        return value[Internal.idSymbol]
    }

    return value
}

function commit(callback: Internal.UpdateOfSharedCallback): void {
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

function queueCommit(callback: Internal.UpdateOfSharedCallback): void {
    callback.isWaitingCommit = true

    fire(async () => {
        await Promise.resolve() // Yield to event loop

        commit(callback)
        callback.isWaitingCommit = false
    })
}

export function reactivePropertyDescriptor<T extends object>(
    schema: T,
    k: PropertyKey,
    index: number
): PropertyDescriptor {
    interface This extends Internal.Shared {
        [signalSymbol]: ReturnType<typeof createSignal<unknown>>
    }
    const signalSymbol = Symbol(k.toString())

    if (typeof schema === 'object') {
        assume<{ [Internal.constructorSymbol]: object }>(schema)
        schema[Internal.constructorSymbol] ??= makePlain(schema)
    }

    function get_primitive(this: This): unknown {
        // Lazy-create signal on first access
        if (!this[signalSymbol]) {
            this[signalSymbol] = createSignal<unknown>(undefined)
        }

        const [getter] = this[signalSymbol]
        return getter()
    }

    function set_primitive(this: This, value: unknown): void {
        // Lazy-create signal on first access
        if (!this[signalSymbol]) {
            this[signalSymbol] = createSignal<unknown>(undefined)
        }

        const [, setter] = this[signalSymbol]

        // Notify listeners before setting (for backwards compatibility with share system)
        // if (this[Internal.listenersOfSharedSymbol] != null) {
        //     const map = this[Internal.listenersOfSharedSymbol]
        //     map.forEach((count, callback) => {
        //         assume<UpdateOfSharedCallback>(callback)

        //         callback.set ??= new Map()

        //         if (callback.set.has(this)) {
        //             const set = callback.set.get(this)
        //             set[index] = value as UpdateOfShared.primitive
        //         } else {
        //             const set: UpdateOfShared.primitive[] = []
        //             callback.set.set(this, set)
        //             set[index] = value as UpdateOfShared.primitive
        //         }

        //         if (!callback.isWaitingCommit) {
        //             queueCommit(callback)
        //         }
        //     })
        // }

        // Update signal value
        setter(value)
    }

    function set_array_or_object(this: This, value: unknown): void {
        // If it's a primitive value, use set_primitive instead
        if (typeof value !== 'object' || value === null) {
            return set_primitive.call(this, value)
        }

        let object = value
        assume<{ [Internal.constructorSymbol]: Class }>(schema)

        if (!Array.isArray(object) && object.constructor.schema == null) {
            object = new schema[Internal.constructorSymbol](object)
        }

        // Get previous value from signal
        if (!this[signalSymbol]) {
            this[signalSymbol] = createSignal<unknown>(undefined)
        }

        const [getter] = this[signalSymbol]
        const previousObject = getter() as This

        if (this[Internal.listenersOfSharedSymbol] != null) {
            if (previousObject != null) {
                if (previousObject.constructor == null) {
                    throw new UnknownObjectError('object')
                }

                Internal.unobserve(previousObject, previousObject.constructor.schema, [
                    ...this[Internal.listenersOfSharedSymbol].keys(),
                ])
            }

            if (object != null) {
                Internal.observe(object, object.constructor.schema, [
                    ...this[Internal.listenersOfSharedSymbol].keys(),
                ])
            }
        }

        set_primitive.call(this, object)
    }

    if (schema == null) {
        return {
            get: get_primitive,
            set: set_array_or_object,
            enumerable: true,
            configurable: true,
        }
    } else if (Array.isArray(schema)) {
        return {
            get: get_primitive,
            set: set_array_or_object,
            enumerable: true,
            configurable: true,
        }
    } else if (typeof schema === 'object' || typeof schema === 'function') {
        return {
            get: get_primitive,
            set: set_array_or_object,
            enumerable: true,
            configurable: true,
        }
    } else {
        return {
            get: get_primitive,
            set: set_primitive,
            enumerable: true,
            configurable: true,
        }
    }
}

export function reactivePropertyDescriptorMap<T extends object>(
    schema: T
): Record<PropertyKey, PropertyDescriptor> {
    const map: Record<PropertyKey, PropertyDescriptor> = {}
    let index = 0

    for (const [k, schema_] of Object.entries(schema)) {
        map[k] = reactivePropertyDescriptor(schema_, k, index++)
    }

    return map
}

export default function reactive<T extends object>(
    schema: T
): (target: Class, k: keyof T) => PropertyDescriptor {
    return function reactive(target: Class, k: keyof T) {
        assume<{ [Internal.propertyIndexSymbol]: number }>(target)
        target[Internal.propertyIndexSymbol] ??= 0
        const index = target[Internal.propertyIndexSymbol]++
        return reactivePropertyDescriptor(schema, k, index)
    }
}
