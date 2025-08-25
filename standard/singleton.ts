import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
}

namespace lib {
    export function singleton<T extends Class>(target: T & { singleton: InstanceType<T> }): T {
        target.singleton = new target() as InstanceType<T>
        return target
    }
}

globalify(lib)
