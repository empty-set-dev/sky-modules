import local from './__local'

export default function reactivePropertyDescriptors<T extends object>(
    schema: T
): Record<string, PropertyDescriptor> {
    const propertiesMap: Record<PropertyKey, PropertyDescriptor> = {}
    const listenersSymbol = Symbol('listeners')

    interface This extends Record<symbol | string, unknown> {
        [listenersSymbol]: Set<object>
    }

    Object.keys(schema).map(k => {
        const property = schema[k as keyof T] as {
            [local.constructorSymbol]: new <T>(object: T) => T
        }
        const valueSymbol = `${k}_`

        if (property == null) {
            //
        } else if (Array.isArray(property)) {
            propertiesMap[k] = {
                get(this: This): unknown {
                    return this[valueSymbol]
                },
                set(this: This, value: unknown): void {
                    this[valueSymbol] = value
                },
                enumerable: true,
                configurable: true,
            }
        } else if (typeof property === 'object') {
            const constructor = local.makePlain(property) as ReturnType<typeof local.makePlain> &
                (new (object: object) => object)
            property[local.constructorSymbol] = constructor
            propertiesMap[k] = {
                get(this: This): unknown {
                    return this[valueSymbol]
                },
                set(this: This, value: { constructor: local.Static }): void {
                    if (value.constructor.schema) {
                        this[valueSymbol] = value
                        return
                    }

                    this[valueSymbol] = new constructor(value)
                },
                enumerable: true,
                configurable: true,
            }
        } else {
            propertiesMap[k] = {
                get(this: This): unknown {
                    // if (local.reactions.length > 0) {
                    //     this[listenersSymbol] ??= new Set()
                    //     const reaction = local.reactions.last()
                    //     this[listenersSymbol].add(reaction)
                    // }

                    return this[valueSymbol]
                },
                set(this: This, value: unknown): void {
                    this[valueSymbol] = value

                    // if (this[listenersSymbol] && this[listenersSymbol].size > 0) {
                    //     this[listenersSymbol].forEach(reaction_ => {
                    //         reaction(reaction_ as () => void)
                    //     })
                    // }
                },
                enumerable: true,
                configurable: true,
            }
        }
    })

    return propertiesMap
}
