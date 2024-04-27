import globalify from 'helpers/globalify'

import Link from './-Link'
import { __ON_END, __ON_END_LIST } from './__'
import __atEnd from './__atEnd'
import __signalEnd from './__signalEnd'

declare global {
    function defineEffect<A extends unknown[], ER, EA extends unknown[]>(
        effect: (resolve: (...args: EA) => Promise<Awaited<ER>>, ...args: A) => (...args: EA) => ER
    ): (link: Link, ...args: A) => Effect<ER, EA>

    abstract class Effect<R = void, A extends unknown[] = []> extends Link<R, A> {
        readonly link

        constructor(link: Link)

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
    __signalEnd.call(this)
    return this['resolve'](await this[__ON_END](...args))
}

namespace module {
    export function defineEffect<A extends unknown[], ER, EA extends unknown[]>(
        effect: (resolve: (...args: EA) => Promise<Awaited<ER>>, ...args: A) => (...args: EA) => ER
    ): (link: Link, ...args: A) => Effect<ER, EA> {
        return (link: Link, ...args: A) => {
            const effect_ = __atEnd(link, (...args: EA) => callback(...args))
            const callback = effect(effect_['resolve'] as never, ...args)
            return effect_
        }
    }

    export abstract class Effect<R = void, A extends unknown[] = []> extends Link<R, A> {
        readonly link: Link

        constructor(link: Link) {
            super()

            this.link = link

            if (!(link instanceof Link) && (link as { constructor }).constructor.fromFactory !== false) {
                throw new Error('link missing')
            }

            if (link[__ON_END_LIST]) {
                return
            }

            link[__ON_END_LIST] = []
            link[__ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await __signalEnd.call(this)
                    return
                }

                return this.resolve(await this[__ON_END]())
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
            const originalDispose = this[__ON_END]
            this[__ON_END] = (...args: A): Promise<Awaited<R>> => {
                return dispose(originalDispose, ...args)
            }
        }
    }
}

globalify(module)
