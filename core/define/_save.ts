export {}

declare global {
    type save = typeof lib.save
    const save: typeof lib.save
}

namespace lib {
    define('sky.core.save', save)
    export function save<T>(value: T): string {
        return JSON.stringify(value)
    }
}

Object.assign(global, lib)
