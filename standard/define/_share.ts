import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    type share = typeof lib.share
    const share: typeof lib.share
}

namespace lib {
    define('sky.standard.share', share)
    export function share(target: Object, callback: () => void): void {
        if (!extends_type<{ [local.idSymbol]: number }>(target)) {
            return null!
        }

        if (target[local.idSymbol] == null) {
            Object.defineProperty(target, local.idSymbol, {
                enumerable: false,
                value: ++local.uniqueId,
                configurable: false,
                writable: false,
            })
        }

        target
        callback

        const prototype = Object.getPrototypeOf(target)

        if (prototype === Object.prototype) {
            throw Error('try sync unknown object')
        }

        callback()
    }
}

globalify(lib)
