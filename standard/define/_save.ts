import globalify from 'sky/utilities/globalify'

declare global {
    type save = typeof lib.save
    const save: typeof lib.save
}

namespace lib {
    define('sky.standard.save', save)
    export function save<T>(value: T): string {
        return JSON.stringify(value)
    }
}

globalify(lib)
