import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
    const getSingleton: typeof lib.getSingleton
}

namespace lib {
    const singletonSymbol = Symbol('singleton')

    export function singleton<T extends Class>(target: T): T {
        extends_type<{ [singletonSymbol]: InstanceType<T> }>(target)

        target[singletonSymbol] = new target() as InstanceType<T>

        Object.setPrototypeOf(singleton, target)

        function singleton(): void {
            throw Error('duplicated singleton')
        }

        return singleton as (() => void) & T
    }

    function isSingleton<T extends Class>(
        SingletonClass: T
    ): SingletonClass is T & { [singletonSymbol]: InstanceType<T> } {
        extends_type<{ [singletonSymbol]: InstanceType<T> }>(SingletonClass)

        return SingletonClass[singletonSymbol] != null
    }

    export function getSingleton<T extends Class & { self: string }>(
        SingletonClass: T
    ): Record<T['self'], InstanceType<T>> {
        if (!isSingleton(SingletonClass)) {
            throw Error('not a singleton')
        }

        return { [SingletonClass.self]: SingletonClass[singletonSymbol] } as Record<
            T['self'],
            InstanceType<T>
        >
    }
}

globalify(lib)
