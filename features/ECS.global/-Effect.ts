import { _ON_END, _ON_END_LIST } from './--'
import _atEnd from './--atEnd'
import _Effects from './--Effects'
import _signalEnd from './--signalEnd'

declare global {
    function effect<A extends unknown[], ER, EA extends unknown[]>(
        effect: (resolve: (...args: EA) => Promise<Awaited<ER>>, ...args: A) => (...args: EA) => ER
    ): (link: Effects, ...args: A) => Effect<ER, EA>

    abstract class Effect<R = void, A extends unknown[] = []> extends _Effects<R, A> {
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
    _signalEnd.call(this)
    return this['resolve'](await this[_ON_END](...args))
}

namespace module {
    export function effect<A extends unknown[], ER, EA extends unknown[]>(
        effect: (resolve: (...args: EA) => Promise<Awaited<ER>>, ...args: A) => (...args: EA) => ER
    ): (link: Effects, ...args: A) => Effect<ER, EA> {
        return (link: Effects, ...args: A) => {
            const effect_ = _atEnd(link, (...args: EA) => callback(...args))
            const callback = effect(effect_['resolve'] as never, ...args)
            return effect_
        }
    }

    export abstract class Effect<R = void, A extends unknown[] = []> extends _Effects<R, A> {
        constructor(link: Effects) {
            super()

            if (
                !(link instanceof _Effects) &&
                (link as { constructor }).constructor.isPure !== false
            ) {
                throw new Error('link missing')
            }

            if (link[_ON_END_LIST]) {
                return
            }

            link[_ON_END_LIST] = []
            link[_ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await _signalEnd.call(this)
                    return
                }

                return this.resolve(await this[_ON_END]())
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
            const originalDispose = this[_ON_END]
            this[_ON_END] = (...args: A): Promise<Awaited<R>> => {
                return dispose(originalDispose, ...args)
            }
        }
    }
}

Object.assign(global, module)
