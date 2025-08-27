import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
    const getSingleton: typeof lib.getSingleton
}

namespace lib {
    const singletonSymbol = Symbol('singleton')

    export function singleton<T extends Class & { readonly singleton: string }>(target: T): void {
        if (!extends_type<{ [singletonSymbol]: InstanceType<T> }>(target)) {
            return null!
        }

        target[singletonSymbol] = new target() as InstanceType<T>

        Object.setPrototypeOf(singleton, target)

        function singleton(): void {
            throw Error('duplicated singleton')
        }

        return singleton as void & (() => never)
    }

    export function getSingleton<T extends Class & { singleton: string }>(
        SingletonClass: T
    ): Record<T['singleton'], InstanceType<T>> {
        if (!extends_type<{ [singletonSymbol]: InstanceType<T> }>(SingletonClass)) {
            return null!
        }

        return { app: SingletonClass[singletonSymbol] } as Record<T['singleton'], InstanceType<T>>
    }
}

globalify(lib)
