import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
}

namespace lib {
    export function singleton<T extends Class>(target: T): void {
        const singletonName = target.name.toLowerCase()

        if (!extends_type<{ [singletonName]: InstanceType<T> }>(global)) {
            return null!
        }

        global[singletonName] = new target() as InstanceType<T>

        return function () {
            throw Error('duplicated singleton')
        } as void & (() => never)
    }
}

globalify(lib)
