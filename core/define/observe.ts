import assume from '../assume'

import { CallbackNotFoundError, NoListenersError } from './errors'
import Internal from './internal/internal'

export function observe(
    target: Object,
    schema: object,
    callbacks: Internal.UpdateOfSharedCallback[]
): void {
    assume<Internal.Shared>(target)

    if (target[Internal.idSymbol] == null) {
        target[Internal.idSymbol] = ++Internal.uniqueId
    }

    const map = (target[Internal.listenersOfSharedSymbol] ??= new Map())

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i]

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
        for (const [k, property] of Object.entries(schema)) {
            const value = target[k as keyof Object]

            if (typeof property === 'object' && value != null && typeof value === 'object') {
                observe(value, property, callbacks)
            }
        }
    }
}

export function unobserve(
    target: Object,
    schema: object,
    callbacks: Internal.UpdateOfSharedCallback[]
): void {
    assume<Internal.Shared>(target)

    const map = target[Internal.listenersOfSharedSymbol]

    if (map == null) {
        throw new NoListenersError()
    }

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i]
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
        for (const [k, property] of Object.entries(schema)) {
            const value = target[k as keyof Object]

            if (typeof property === 'object' && value != null && typeof value === 'object') {
                unobserve(value, property, callbacks)
            }
        }
    }
}
