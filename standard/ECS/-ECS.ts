import globalify from 'utilities/globalify'

declare global {
    function effect<A extends unknown[], T, ER, EA extends unknown[]>(
        effect: (
            this: T,
            resolve: (...args: EA) => Promise<Awaited<ER>>,
            ...args: A
        ) => (...args: EA) => ER
    ): (link: Effects, ...args: A) => Effect<ER, EA>
}

namespace module {
    
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
        const callback = effect(effect_['resolve'] as never, ...args)
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
    ward: module.ward,
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

    export class EventListener<K extends keyof WindowEventMap, R> extends Effect {
        constructor(
            link: Effects,
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => R,
            options?: boolean | AddEventListenerOptions
        ) {
            super(link)

            const handle = (...args): void => {
                this.resolve(listener.call(this, ...args))
            }

            addEventListener(type, handle, options)
            this.dispose = async (dispose): Promise<void> => {
                await dispose()
                removeEventListener(type, handle, options) as never
            }
        }
    }
}

globalify({
    Timeout: module.Timeout,
    Interval: module.Interval,
    AnimationFrame: module.AnimationFrame,
    AnimationFrames: module.AnimationFrames,
    EventListener: module.EventListener,
})
