import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
    const getSingleton: typeof lib.getSingleton
}

namespace local {
    export const singletonSymbol = Symbol('singleton')

    export function isSingleton<T extends Class>(
        SingletonClass: T
    ): SingletonClass is T & { [singletonSymbol]: InstanceType<T> } {
        extends_type<{ [singletonSymbol]: InstanceType<T> }>(SingletonClass)

        return SingletonClass[singletonSymbol] != null
    }
}

namespace lib {
    export function singleton<T extends Class>(target: T): T {
        extends_type<{ [local.singletonSymbol]: InstanceType<T> }>(target)

        target[local.singletonSymbol] = new target() as InstanceType<T> & {
            start?: () => void | Promise<void>
        }

        Object.setPrototypeOf(singleton, target)

        function singleton(): void {
            throw Error('duplicated singleton')
        }

        return singleton as (() => void) & T
    }

    export function getSingleton<T extends Class>(SingletonClass: T): InstanceType<T> {
        if (!local.isSingleton(SingletonClass)) {
            throw Error('not a singleton')
        }

        return SingletonClass[local.singletonSymbol]
    }
}

globalify(lib)
