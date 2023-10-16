import { _ON_END } from './--'
import _Effects from './--Effects'
import _signalEnd from './--signalEnd'

export {}

declare global {
    class Entities<R = void, A extends unknown[] = []> extends _Effects<R, A> {
        constructor(systems?: {}[])

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
    _signalEnd.call(this)
    return this['resolve'](await this[_ON_END](...args))
}

namespace module {
    export class Entities<R = void, A extends unknown[] = []> extends _Effects<R, A> {
        constructor(systems: {}[]) {
            super()

            this.__systems = systems
        }

        get destroy(): (...args: A) => Promise<Awaited<R>> {
            return destroy
        }

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        ) {
            const originalDestroy = this[_ON_END]
            this[_ON_END] = (...args: A): Promise<Awaited<R>> => {
                return destroy(originalDestroy, ...args)
            }
        }

        private ['__systems']: {}[]
    }
}

Object.assign(global, module)
