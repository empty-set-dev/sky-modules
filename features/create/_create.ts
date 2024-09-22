export {}

declare global {
    class WithCreate {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(NewIsProhibited: NewIsProhibited)

        set destroy(fn: () => void | Promise<void>)
        get destroy(): () => Promise<void>
    }

    function create<
        Instance,
        Args extends unknown[],
        T extends Class<
            Instance & {
                create?(...args: Args): void | Promise<void>
            } & WithCreate,
            [NewIsProhibited]
        >
    >(class_: T, ...args: Args): Promise<InstanceType<T>>
}

abstract class NewIsProhibited {
    private NewIsProhibitedId!: void
}

const destroySymbol = Symbol('destroy')

namespace lib {
    export class WithCreate {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(NewIsProhibited: NewIsProhibited) {
            //
        }

        set destroy(fn: () => void | Promise<void>) {
            this[destroySymbol] = fn as () => Promise<void>
        }

        get destroy(): () => Promise<void> {
            return this[destroySymbol] as () => Promise<void>
        }

        [destroySymbol]?: () => Promise<void>
    }

    export async function create<
        Instance,
        Args extends unknown[],
        T extends Class<
            Instance & {
                create?(...args: Args): void | Promise<void>
            } & WithCreate,
            [NewIsProhibited]
        >
    >(class_: T, ...args: Args): Promise<InstanceType<T>> {
        const instance = new class_(null as never)
        instance.create && (await instance.create(...args))
        return instance as InstanceType<T>
    }
}

Object.assign(global, lib)
