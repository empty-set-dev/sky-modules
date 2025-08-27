import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
    const getSingleton: typeof lib.getSingleton
}

namespace lib {
    const singletonSymbol = Symbol('singleton')

    export function singleton<T extends Class & { readonly self: string }>(target: T): void & Record<T['self'], InstanceType<T>> {
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

    export function getSingleton<T extends Class & { self: string }>(
        SingletonClass: T
    ): Record<T['self'], InstanceType<T>> {
        if (!extends_type<{ [singletonSymbol]: InstanceType<T> }>(SingletonClass)) {
            return null!
        }

        return { app: SingletonClass[singletonSymbol] } as Record<T['self'], InstanceType<T>>
    }
}

globalify(lib)
