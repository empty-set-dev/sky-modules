import { createSignal } from 'solid-js'

export default function makeReactive<T extends Class>(
    Class: T,
    example: Record<PropertyKey, unknown>
): T {
    const prototype = Class.prototype

    for (const key of Object.keys(example)) {
        const symbolKey = Symbol(key.toString())

        type This = Record<PropertyKey, [() => unknown, (newValue: unknown) => void]>

        Object.defineProperty(prototype, key, {
            get(this: This) {
                if (!Object.hasOwnProperty.call(this, symbolKey)) {
                    const [get, set] = createSignal(prototype[key])
                    this[symbolKey] = [get, set]
                }

                const [get] = this[symbolKey]
                return get()
            },
            set(this: This, newValue: unknown) {
                if (!Object.hasOwnProperty.call(this, symbolKey)) {
                    const [get, set] = createSignal(newValue)
                    this[symbolKey] = [get, set]
                }

                const [, set] = this[symbolKey]
                set(newValue)
            },
            enumerable: true,
            configurable: true,
        })
    }

    return Class
}
