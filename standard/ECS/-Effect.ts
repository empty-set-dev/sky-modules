import { ON_END_LIST, ON_END, ON_DESTROY } from './-'
import { signalEnd } from './--signalEnd'

export {}

declare global {
    abstract class Effect<R = void, A extends unknown[] = []> extends module.Effects {
        constructor(link: Effects)

        get dispose(): (...args: A) => Promise<Awaited<R>>

        set dispose(
            dispose: (
                nextDispose: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )
    }
}

async function dispose<R, A extends unknown[]>(
    this: Effect<R, A>,
    ...args: A
): Promise<Awaited<R>> {
    signalEnd.call(this)
    return this['resolve'](await this[ON_END](...args))
}

namespace module {
    export abstract class Effect<R = void, A extends unknown[] = []> extends Effects<R, A> {
        constructor(link: Effects) {
            super()

            if (link[ON_END_LIST]) {
                return
            }

            link[ON_END_LIST] = []
            link[ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await signalEnd.call(this)
                    return
                }

                return this.resolve(await this[ON_END]())
            })
        }

        get dispose(): (...args: A) => Promise<Awaited<R>> {
            return dispose
        }

        set dispose(
            dispose: (
                nextDispose: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        ) {
            const originalDispose = this[ON_END]
            this[ON_END] = (...args: A): Promise<Awaited<R>> => {
                return dispose(originalDispose, ...args)
            }
        }
    }
}

Object.assign(global, module)
