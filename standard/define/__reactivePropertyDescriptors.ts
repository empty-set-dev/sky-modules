import local from './__local'

function toPrimitive(
    value: UpdateOfShared.primitive | object | Function
): UpdateOfShared.primitive {
    if (typeof value === 'object' || typeof value === 'function') {
        as<{ [local.idSymbol]?: number }>(value)

        if (value[local.idSymbol] == null) {
            throw typeof value === 'object' ? Error('unknown object') : Error('unknown function')
        }

        return (value as local.Shared)[local.idSymbol]
    }

    return value
}

function commit(callback: local.UpdateOfSharedCallback): void {
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
            object[local.idSymbol],
            set.reduce(
                (array, value, i): [number, UpdateOfShared.primitive][] => {
                    return array.concat([i, toPrimitive(value)])
                },
                [] as [number, UpdateOfShared.primitive][]
            ),
        ])
        prettyUpdates.set.push([
            object.constructor[local.uidSymbol],
            object[local.idSymbol],
            prettySet,
        ])
    })

    callback(plainUpdates, prettyUpdates)
}

function queueCommit(callback: local.UpdateOfSharedCallback): void {
    callback.isWaitingCommit = true

    async(async () => {
        await switch_thread()

        commit(callback)
    })
}

export default function reactivePropertyDescriptors<T extends object>(
    schema: T
): Record<string, PropertyDescriptor> {
    const propertiesMap: Record<PropertyKey, PropertyDescriptor> = {}

    const schemaKeys = Object.keys(schema)
    schemaKeys.map((k, i) => {
        interface This extends local.Reactive, local.Shared {
            [valueSymbol]: unknown
        }
        const property = schema[k as keyof T] as {
            [local.constructorSymbol]: new <T>(object: T) => T
        }
        const valueSymbol = `${k}_`

        if (typeof property === 'object') {
            property[local.constructorSymbol] ??= local.makePlain(property) as ReturnType<
                typeof local.makePlain
            > &
                (new (object: object) => object)
        }

        function get_primitive(this: This): unknown {
            // if (local.reactions.length > 0) {
            //     this[listenersSymbol] ??= new Set()
            //     const reaction = local.reactions.last()
            //     this[listenersSymbol].add(reaction)
            // }

            return this[valueSymbol]
        }
        function set_primitive(this: This, value: unknown): void {
            // if (this[listenersSymbol] && this[listenersSymbol].size > 0) {
            //     this[listenersSymbol].forEach(reaction_ => {
            //         reaction(reaction_ as () => void)
            //     })
            // }

            if (this[local.listenersOfShared] != null) {
                const map = this[local.listenersOfShared]
                map.forEach((k, callback) => {
                    as<local.UpdateOfSharedCallback>(callback)

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
                object = new property[local.constructorSymbol](object)
            }

            const previousObject = this[valueSymbol] as This

            if (this[local.listenersOfShared] != null) {
                if (previousObject != null) {
                    if (previousObject.constructor == null) {
                        throw NullError
                    }

                    local.unobserve(previousObject, previousObject.constructor.schema, [
                        ...this[local.listenersOfShared].keys(),
                    ])
                }

                if (object != null) {
                    local.observe(object, object.constructor.schema, [
                        ...this[local.listenersOfShared].keys(),
                    ])
                }
            }

            set_primitive.call(this, object)
        }

        if (property == null) {
            //
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
