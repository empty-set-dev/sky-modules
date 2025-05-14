import globalify from 'sky/utilities/globalify'

declare global {
    function action_hook_mixin(constructor: unknown): (constructor: unknown) => void
}

namespace module {
    export function action_hook_mixin<T extends Class>(
        mixinConstructor: T
    ): (constructor: InstanceType<T>) => void {
        return function decorator(constructor: InstanceType<T>): void {
            Object.keys(mixinConstructor.prototype.__hooks).forEach(k => {
                action_hook(constructor.prototype, k, {
                    value: mixinConstructor.prototype.__hooks[k],
                })
            })
        }
    }
}

globalify(module)
