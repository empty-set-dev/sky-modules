import { CallbackNotFoundError, NoListenersError } from './errors'
import internal from './Internal'

export function observe(
    target: Object,
    schema: Record<PropertyKey, unknown>,
    callbacks: UpdateOfSharedCallback[]
): void {
    as<internal.Shared>(target)

    if (target[internal.idSymbol] == null) {
        target[internal.idSymbol] = ++internal.uniqueId
    }

    const map = (target[internal.listenersOfShared] ??= new Map())

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i] as internal.UpdateOfSharedCallback

        if (map.has(callback)) {
            map.set(callback, map.get(callback) + 1)
        } else {
            map.set(callback, 1)
        }
    }

    if (Array.isArray(target)) {
        target.forEach(value => {
            if (typeof value === 'object') {
                observe(value, value.constructor.schema, callbacks)
            }
        })
    } else {
        Object.keys(schema).forEach(k => {
            const property = schema[k] as Record<PropertyKey, unknown>
            const value = target[k as keyof Object]

            if (typeof property === 'object' && value != null && typeof value === 'object') {
                observe(value, property, callbacks)
            }
        })
    }
}

export function unobserve(
    target: Object,
    schema: Record<PropertyKey, unknown>,
    callbacks: UpdateOfSharedCallback[]
): void {
    as<internal.Shared>(target)

    const map = target[internal.listenersOfShared]

    if (map == null) {
        throw new NoListenersError()
    }

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i] as internal.UpdateOfSharedCallback
        const counter = map.get(callback)

        if (counter == null) {
            throw new CallbackNotFoundError()
        }

        if (counter > 1) {
            map.set(callback, counter - 1)
        } else {
            map.delete(callback)
        }
    }

    if (Array.isArray(target)) {
        target.forEach(value => {
            if (typeof value === 'object') {
                unobserve(value, value.constructor.schema, callbacks)
            }
        })
    } else {
        Object.keys(schema).forEach(k => {
            const property = schema[k] as Record<PropertyKey, unknown>
            const value = target[k as keyof Object]

            if (typeof property === 'object' && value != null && typeof value === 'object') {
                unobserve(value, property, callbacks)
            }
        })
    }
}
