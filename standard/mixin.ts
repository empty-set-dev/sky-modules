import globalify from 'sky/utilities/globalify'

declare global {
    function mixin<MT extends Class, T extends Class>(
        mixinConstructor: MT
    ): (constructor: T) => void
}

namespace lib {
    export function mixin<MT extends Class, T extends Class>(
        mixinConstructor: MT
    ): (constructor: T) => void {
        return function decorator(constructor: T): void {
            Object.keys(mixinConstructor.prototype.__hooks).forEach(k => {
                hook(constructor.prototype, k, {
                    value: mixinConstructor.prototype.__hooks[k],
                })
            })

            const propertyDescriptors = Object.getOwnPropertyDescriptors(mixinConstructor.prototype)

            Object.keys(propertyDescriptors).forEach(k => {
                if (k === '__hooks') {
                    return
                }

                if (propertyDescriptors[k].value == null) {
                    return
                }

                Object.defineProperty(constructor.prototype, k, propertyDescriptors[k])
            })
        }
    }
}

globalify(lib)
