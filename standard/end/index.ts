import 'types/Promise'
import globalify from 'utilities/globalify'

declare global {
    type Effect<R = void, A extends unknown[] = []> =
        | { dispose(...args: A): Promise<Awaited<R>>; end: Promise<Awaited<R>> }
        | { destroy(...args: A): Promise<Awaited<R>>; end: Promise<Awaited<R>> }

    const Effects: Effect

    function until<R, A extends unknown[]>(
        callback: (end: (value: R | PromiseLike<R>) => void, ...args: A) => R,
        ...args: A
    ): Promise<R>

    function use<R, A extends unknown[], UseR>(
        link: Effect<R, A>,
        effect: () => () => UseR
    ): Effect<UseR, []>

    function useAsync<R, A extends unknown[], UseR>(
        link: Effect<R, A>,
        effect: () => Promise<() => UseR>
    ): Promise<Effect<UseR, []>>

    function atEnd<R, A extends unknown[], UseR>(
        link: Effect<R, A>,
        onEnd: () => UseR
    ): Effect<UseR, []>
}

const ON_END_LIST = Symbol('OnEndList')
const ON_END = Symbol('OnEnd')
const ON_DESTROY = Symbol('OnDestroy')

abstract class Effects<R = void, A extends unknown[] = []> {
    readonly end = new Promise<Awaited<R>>(
        r =>
            (this.resolve = (value: Awaited<R>): Promise<Awaited<R>> => {
                r(value)
                return this.end
            })
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [ON_END] = async (isFinal: boolean, ...args: A): Promise<Awaited<R>> => {
        if (this[ON_END_LIST]) {
            if (isFinal === true) {
                for (let i = 0; i < this[ON_END_LIST].length; i++) {
                    await this[ON_END_LIST][i](true)
                }

                delete this[ON_END_LIST]
            } else {
                for (let i = 0; i < this[ON_END_LIST].length; i++) {
                    await this[ON_END_LIST][i](false)
                }
            }
        }

        return
    }

    protected resolve!: (value: Awaited<R>) => Promise<Awaited<R>>
}

class Effect<R = void, A extends unknown[] = []> extends Effects<R, A> {
    constructor(link: Effects) {
        super()

        link[ON_END_LIST] ??= []
        link[ON_END_LIST].push(async (isFinal: boolean, ...args: A) => {
            if (isFinal) {
                return this.resolve(await this[ON_END](isFinal, ...args))
            }

            this[ON_DESTROY] = true
            return this[ON_END](isFinal, ...args)
        })
    }

    get dispose(): (...args: A) => Promise<Awaited<R>> {
        const onEnd = this[ON_END]
        return async (...args: A): Promise<Awaited<R>> => {
            this[ON_DESTROY] = true
            await onEnd(false, ...args)
            return this.resolve(await onEnd(true, ...args))
        }
    }

    set dispose(
        dispose: (
            nextDispose: (...args: A) => Promise<Awaited<R>>,
            ...args: A
        ) => Promise<Awaited<R>>
    ) {
        const originalDispose = this[ON_END]
        this[ON_END] = (isFinal: boolean, ...args: A): Promise<Awaited<R>> => {
            if (!isFinal) {
                return originalDispose(false, ...args)
            }

            return dispose((...args: A) => originalDispose(true, ...args), ...args)
        }
    }
}

class Entities<R = void, A extends unknown[] = []> extends Effects<R, A> {
    get destroy(): (...args: A) => Promise<Awaited<R>> {
        return async (...args: A): Promise<Awaited<R>> => {
            this[ON_DESTROY] = true
            await this[ON_END](false, ...args)
            return this.resolve(await this[ON_END](true, ...args))
        }
    }

    set destroy(
        destroy: (
            nextDestroy: (...args: A) => Promise<Awaited<R>>,
            ...args: A
        ) => Promise<Awaited<R>>
    ) {
        const originalDestroy = this[ON_END]
        this[ON_END] = (isFinal: boolean, ...args: A): Promise<Awaited<R>> => {
            if (!isFinal) {
                this[ON_END][ON_DESTROY] = true
                return originalDestroy(false, ...args)
            }

            return destroy((...args: A) => originalDestroy(true, ...args), ...args)
        }
    }
}

class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
    constructor(link: Effects) {
        super()

        link[ON_END_LIST] ??= []
        link[ON_END_LIST].push((isFinal: boolean, ...args: A) => {
            this[ON_DESTROY] = true
            return this[ON_END](isFinal, ...args)
        })
    }
}

export async function until<T, A extends unknown[]>(
    callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
    ...args: A
): Promise<T> {
    return new Promise(r => callback(r, ...args))
}

function use<R, A extends unknown[], UseR>(
    link: Effect<R, A>,
    effect: () => () => UseR
): Effect<UseR, []> {
    return atEnd(link, effect())
}

async function useAsync<R, A extends unknown[], UseAsyncR>(
    link: Effect<R, A>,
    effect: () => Promise<() => UseAsyncR>
): Promise<Effect<UseAsyncR, []>> {
    return atEnd(link, await effect())
}

function atEnd<R, A extends unknown[], EndR>(
    link: Effect<R, A>,
    onEnd: () => EndR
): Effect<EndR, []> {
    let resolve: (value: Awaited<EndR>) => void
    const self = {
        async dispose(): Promise<Awaited<EndR>> {
            if (self[ON_END]) {
                for (let i = 0; i < self[ON_END].length; i++) {
                    await self[ON_END][i]()
                }
            }

            const result = await onEnd()

            resolve(result)

            return result
        },
        end: new Promise<Awaited<EndR>>(r => (resolve = r)),
    }

    link[ON_END_LIST] ??= []
    link[ON_END_LIST].push(onEnd)

    return self as never
}

globalify({
    until,
    use,
    useAsync,
    atEnd,
    Effects,
    Effect,
    Entity,
})

//
declare global {
    const Timeout: typeof module.Timeout
    const Interval: typeof module.Interval
}

namespace module {
    export class Timeout<R> extends Effect<void | R> {
        constructor(
            link: Effects,
            callback: (...args: unknown[]) => R,
            timeout?: number,
            ...args: unknown[]
        ) {
            super(link)

            const { dispose } = this

            const identifier = setTimeout(async () => {
                this.resolve(await callback(...args))
                dispose()
            }, timeout)

            this.dispose = async (dispose): Promise<void | Awaited<R>> => {
                await dispose()

                clearTimeout(identifier)
            }
        }
    }

    export class Interval<R> extends Effect<void | R> {
        constructor(
            link: Effects,
            callback: (...args: unknown[]) => R,
            interval?: number,
            ...args: unknown[]
        ) {
            super(link)

            const identifier = setInterval(async () => {
                this.resolve(await callback(...args))
            }, interval)

            this.dispose = async (dispose): Promise<void | Awaited<R>> => {
                await dispose()

                clearInterval(identifier)
            }
        }
    }
}

globalify({
    Timeout: module.Timeout,
    Interval: module.Interval,
})
