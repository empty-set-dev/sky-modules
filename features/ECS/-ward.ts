import Link from './-Link'

export {}

declare global {
    function ward<T>(object: T): T
}

namespace module {
    export function ward<T>(object: T): T {
        const prototype = Object.getPrototypeOf(object)
        Object.assign(prototype, {
            in: Link.prototype.in,
        })
        return object
    }
}

Object.assign(global, module)
