export {}

declare global {
    class WithCreate {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(NewIsProhibited: NewIsProhibited)

        set destroy(fn: () => Promise<void>)
    }

    function create<
        Instance,
        Args extends unknown[],
        T extends Class<
            Instance & {
                create?(...args: Args): Promise<void>
            } & WithCreate,
            [NewIsProhibited]
        >
    >(class_: T, ...args: Args): Promise<InstanceType<T>>
}

abstract class NewIsProhibited {
    private NewIsProhibitedId!: void
}

namespace lib {
    export class WithCreate {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(NewIsProhibited: NewIsProhibited) {
            //
        }

        set destroy(fn: () => Promise<void>) {
            this.destroy = fn
        }
    }

    export async function create<
        Instance,
        Args extends unknown[],
        T extends Class<
            Instance & {
                create?(...args: Args): Promise<void>
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
