import globalify from 'utilities/globalify'

declare global {
    interface Effects extends module.Effects {}

    abstract class Effect<R = void, A extends unknown[] = []> {
        readonly end: Promise<Awaited<R>>

        constructor(link: Effects)

        in<G>(link: Effects, group: G): this

        get dispose(): (...args: A) => Promise<Awaited<R>>

        set dispose(
            dispose: (
                nextDispose: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )

        protected resolve: (value: Awaited<R>) => Awaited<R>
    }

    class Entities<R = void, A extends unknown[] = []> {
        readonly end: Promise<Awaited<R>>;

        in<G>(link: Effects, group: G): this

        get destroy(): (...args: A) => Promise<Awaited<R>>

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )

        protected resolve: (value: Awaited<R>) => Awaited<R>
    }

    class Entity<R = void, A extends unknown[] = []> {
        constructor(link: Effects)

        in<G>(link: Effects, group: G): this

        get destroy(): (...args: A) => Promise<Awaited<R>>

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )

        protected resolve: (value: Awaited<R>) => Awaited<R>
    }

    function until<R, A extends unknown[]>(
        callback: (end: (value: R | Promise<R>) => void, ...args: A) => R,
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

    function effect<A extends unknown[], T, ER, EA extends unknown[]>(
        effect: (
            this: T,
            resolve: (...args: EA) => Promise<Awaited<ER>>,
            ...args: A
        ) => (...args: EA) => ER
    ): (link: Effects, ...args: A) => Effect<ER, EA>
}

const ON_END_LIST = Symbol('OnEndList')
const ON_END = Symbol('OnEnd')
const ON_DESTROY = Symbol('OnDestroy')

function signalEnd(this: Effects): void {
    this[ON_DESTROY] = true

    if (!this[ON_END_LIST]) {
        return
    }

    for (let i = 0; i < this[ON_END_LIST].length; i++) {
        this[ON_END_LIST][i](true)
    }
}

namespace module {
    export abstract class Effects<R = void, A extends unknown[] = []> {
        private abstract: Effects<R>

        readonly end: Promise<Awaited<R>>

        constructor() {
            ;[this.resolve, this.end] = promise()
        }

        in<G>(link: Effects, group: G): this {
            ;(group as { has }).has(link, this)
            return this
        }

        protected resolve: (value: Awaited<R>) => Awaited<R>

        private async [ON_END](...args: [] | A): Promise<Awaited<R>>
        private async [ON_END](): Promise<Awaited<R>> {
            if (!this[ON_END_LIST]) {
                return
            }

            for (let i = 0; i < this[ON_END_LIST].length; i++) {
                await this[ON_END_LIST][i](false)
            }

            delete this[ON_END_LIST]
        }
    }

    export abstract class Effect<R = void, A extends unknown[] = []> extends Effects<R, A> {
        constructor(link: Effects) {
            super()

            link[ON_END_LIST] ??= []
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

    const dispose = async function dispose<R, A extends unknown[]>(
        this: Effect<R, A>,
        ...args: A
    ): Promise<Awaited<R>> {
        signalEnd.call(this)
        return this.resolve(await this[ON_END](...args))
    }

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

    const destroy = async function destroy<R, A extends unknown[]>(
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
}

async function until<T, A extends unknown[]>(
    callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
    ...args: A
): Promise<T> {
    return new Promise(r => callback(r, ...args))
}

function use<A extends unknown[], EffectR, EffectA extends unknown[]>(
    link: Effects,
    effect: (...args: A) => (...args: EffectA) => EffectR,
    ...args: A
): Effect<EffectR, EffectA> {
    return atEnd(link, effect(...args))
}

async function useAsync<EA extends unknown[], ER, A extends unknown[]>(
    link: Effects,
    effect: (...args: A) => Promise<(...args: EA) => ER>,
    ...args: A
): Promise<Effect<ER, EA>> {
    return atEnd(link, await effect(...args))
}

function effect<A extends unknown[], ER, EA extends unknown[]>(
    effect: (resolve: (...args: EA) => Promise<Awaited<ER>>, ...args: A) => (...args: EA) => ER
): (link: Effects, ...args: A) => Effect<ER, EA> {
    return (link: Effects, ...args: A) => {
        const effect_ = atEnd(link, (...args: EA) => callback(...args))
        const callback = effect(effect_['dispose'], ...args)
        return effect_
    }
}

function atEnd<R, A extends unknown[]>(link: Effects, onEnd: (...args: [] | A) => R): Effect<R, A> {
    const [resolve, end] = promise<Awaited<R>>()

    const self = {
        resolve,
        end,
        async dispose(...args: A): Promise<Awaited<R>> {
            signalEnd.call(this)

            const result = await onEnd(...args)

            if (!this[ON_END_LIST]) {
                return
            }

            for (let i = 0; i < this[ON_END_LIST].length; i++) {
                await this[ON_END_LIST][i](false)
            }

            delete this[ON_END_LIST]

            return resolve(result)
        },
    }

    link[ON_END_LIST] ??= []
    link[ON_END_LIST].push(async (isSignalEnd: boolean) => {
        if (isSignalEnd) {
            signalEnd.call(self)
            return
        }

        const result = await onEnd()

        if (!self[ON_END_LIST]) {
            return
        }

        for (let i = 0; i < self[ON_END_LIST].length; i++) {
            await self[ON_END_LIST][i](false)
        }

        delete self[ON_END_LIST]

        return resolve(result)
    })

    return self as never
}

globalify({
    Effects: module.Effects,
    Effect: module.Effect,
    Entities: module.Entities,
    Entity: module.Entity,
    until,
    use,
    useAsync,
    effect,
})

//
declare global {
    const Timeout: typeof module.Timeout
    const Interval: typeof module.Interval
    const AnimationFrame: typeof module.AnimationFrame
    const AnimationFrames: typeof module.AnimationFrames
    const EventListener: typeof module.EventListener
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
                await dispose()
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

    export const AnimationFrame = effect(
        <A extends unknown[], R>(resolve, callback: (...args: A) => R, ...args: A) => {
            const identifier = requestAnimationFrame(async () => resolve(await callback(...args)))
            return (): void | R => cancelAnimationFrame(identifier)
        }
    )

    export const AnimationFrames = effect(
        <A extends unknown[], R>(resolve, callback: (...args: A) => R, ...args: A) => {
            let identifier = requestAnimationFrame(frame)
            async function frame(): Promise<void> {
                resolve(await callback(...args))
                identifier = requestAnimationFrame(frame)
            }
            return (): void | R => cancelAnimationFrame(identifier)
        }
    )

    export const EventListener = effect(
        <K extends keyof WindowEventMap, R>(
            resolve,
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => R,
            options?: boolean | AddEventListenerOptions
        ) => {
            addEventListener(
                type,
                function (...args) {
                    resolve(listener.call(this, ...args))
                },
                options
            )
            return (): void => removeEventListener(type, listener, options) as never
        }
    )
}

globalify({
    Timeout: module.Timeout,
    Interval: module.Interval,
    AnimationFrame: module.AnimationFrame,
    AnimationFrames: module.AnimationFrames,
})
