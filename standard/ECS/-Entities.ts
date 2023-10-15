import { ON_END } from './-'

export {}

declare global {
    class Entities<R = void, A extends unknown[] = []> extends module.Effects {
        get destroy(): (...args: A) => Promise<Awaited<R>>

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )
    }
}

async function destroy<R, A extends unknown[]>(
    this: Entity<R, A>,
    ...args: A
): Promise<Awaited<R>> {
    signalEnd.call(this)
    return this.resolve(await this[ON_END](...args))
}

export class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
    constructor(link: Effects) {
        super()

        link[ON_END_LIST] ??= []
        link[ON_END_LIST].push(async (isSignalEnd: boolean) => {
            if (isSignalEnd) {
                signalEnd.call(this)
                return
            }

            return this.resolve(await this[ON_END]())
        })
    }
}

namespace module {
    export class Entities<R = void, A extends unknown[] = []> extends Effects<R, A> {
        get destroy(): (...args: A) => Promise<Awaited<R>> {
            return destroy
        }

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        ) {
            const originalDestroy = this[ON_END]
            this[ON_END] = (...args: A): Promise<Awaited<R>> => {
                return destroy(originalDestroy, ...args)
            }
        }
    }
}

Object.assign(global, module)
