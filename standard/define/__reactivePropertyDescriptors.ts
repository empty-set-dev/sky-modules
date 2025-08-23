import local from './__local'

export default function reactivePropertyDescriptors<T extends object>(
    properties: T
): Record<string, PropertyDescriptor> {
    const propertiesMap: PropertyDescriptorMap = {}
    const listenersSymbol = Symbol('listeners')

    interface This extends Record<symbol, unknown> {
        [listenersSymbol]: Set<object>
    }

    Object.keys(properties).map(k => {
        const valueSymbol = Symbol(k)

        propertiesMap[k] = {
            get(this: This): unknown {
                if (local.reactions.length > 0) {
                    this[listenersSymbol] ??= new Set()
                    const reaction = local.reactions.last()
                    this[listenersSymbol].add(reaction)
                }

                return this[valueSymbol]
            },
            set(this: This, value: unknown): void {
                this[valueSymbol] = value

                if (this[listenersSymbol] && this[listenersSymbol].size > 0) {
                    this[listenersSymbol].forEach(reaction_ => {
                        reaction(reaction_ as () => void)
                    })
                }
            },
            enumerable: true,
            configurable: true,
        }
    })

    return propertiesMap
}
