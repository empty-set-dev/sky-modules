import local from './__local'

export function observe(
    target: Object,
    schema: Record<PropertyKey, unknown>,
    callbacks: UpdateOfSharedCallback[]
): void {
    as<local.Shared>(target)

    if (target[local.idSymbol] == null) {
        target[local.idSymbol] = ++local.uniqueId
    }

    const map = (target[local.listenersOfShared] ??= new Map())

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i] as local.UpdateOfSharedCallback

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

            if (typeof property === 'object') {
                // TODO
                // observe(target[k as keyof Object], property, callbacks)
            }
        })
    }
}

export function unobserve(
    target: Object,
    schema: Record<PropertyKey, unknown>,
    callbacks: UpdateOfSharedCallback[]
): void {
    as<local.Shared>(target)

    const map = target[local.listenersOfShared]

    for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i] as local.UpdateOfSharedCallback
        const counter = map.get(callback)

        if (counter == null) {
            throw NullError
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

            if (typeof property === 'object') {
                // unobserve(target[k as keyof Object], property, callbacks)
            }
        })
    }
}
