import 'standard/Promise'
import Three from 'three'
import globalify from 'utilities/globalify'

declare global {
    interface Effects<R = void, A extends unknown[] = []> extends module.Effects<R, A> {}
    const Effects: typeof module.Effects

    interface Effect<R = void, A extends unknown[] = []> extends module.Effect<R, A> {}
    const Effect: typeof module.Effect

    interface Entities<R = void, A extends unknown[] = []> extends module.Entities<R, A> {}
    const Entities: typeof module.Entities

    interface Entity<R = void, A extends unknown[] = []> extends module.Entity<R, A> {}
    const Entity: typeof module.Entity

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

namespace module {
    export abstract class Effects<R = void, A extends unknown[] = []> {
        readonly end = new Promise<Awaited<R>>(
            r =>
                (this.resolve = (value: Awaited<R>): Awaited<R> => {
                    r(value)
                    return value
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

        protected resolve!: (value: Awaited<R>) => Awaited<R>
    }

    export class Effect<R = void, A extends unknown[] = []> extends Effects<R, A> {
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

    export class Entities<R = void, A extends unknown[] = []> extends Effects<R, A> {
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

    export class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        constructor(link: Effects) {
            super()

            link[ON_END_LIST] ??= []
            link[ON_END_LIST].push((isFinal: boolean, ...args: A) => {
                this[ON_DESTROY] = true
                return this[ON_END](isFinal, ...args)
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

function use<
    LinkR,
    LinkA extends unknown[],
    A extends unknown[],
    EffectR,
    EffectA extends unknown[]
>(
    link: Effects<LinkR, LinkA>,
    effect: (...args: A) => (...args: EffectA) => EffectR,
    ...args: A
): Effect<EffectR, EffectA> {
    return atEnd(link, effect(...args))
}

async function useAsync<
    LinkR,
    LinkA extends unknown[],
    A extends unknown[],
    EffectAsyncR,
    EffectAsyncA extends unknown[]
>(
    link: Effects<LinkR, LinkA>,
    effect: (...args: A) => Promise<(...args: EffectAsyncA) => EffectAsyncR>,
    ...args: A
): Promise<Effect<EffectAsyncR, EffectAsyncA>> {
    return atEnd(link, await effect(...args))
}

function atEnd<R, A extends unknown[], EndR, EndA extends unknown[]>(
    link: Effects<R, A>,
    onEnd: (...args: EndA) => EndR
): Effect<EndR, EndA> {
    let resolve: (value: Awaited<EndR>) => void
    const end = new Promise<Awaited<EndR>>(r => (resolve = r))

    link[ON_END_LIST] ??= []
    link[ON_END_LIST].push(onEnd)

    return {
        resolve(value: Awaited<EndR>): Awaited<EndR> {
            resolve(value)
            return value
        },
        end,
        async dispose(...args: EndA): Promise<Awaited<EndR>> {
            if (self[ON_END_LIST]) {
                for (let i = 0; i < self[ON_END_LIST].length; i++) {
                    await self[ON_END_LIST][i]()
                }

                delete self[ON_END_LIST]
            }

            const result = await onEnd(...args)

            resolve(result)

            return result
        },
    } as never
}

globalify({
    until,
    use,
    useAsync,
    atEnd,
    Effects: module.Effects,
    Effect: module.Effect,
    Entities: module.Entities,
    Entity: module.Entity,
})

//
declare global {
    const Timeout: typeof module.Timeout
    const Interval: typeof module.Interval
    function inScene(link: Effects, object: Three.Object3D, scene: Three.Scene): Effect
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

    export function AnimationFrame<A extends unknown[]>(
        link: Effects,
        callback: (...args: A) => void | Promise<void>,
        ...args: A
    ): Effect {
        const frame = requestAnimationFrame(async () => {
            await callback(...args)
            await effect.dispose()
            effect['resolve']()
        })
        const effect = atEnd(link, async () => {
            await effect.dispose()
            cancelAnimationFrame(frame)
        })
        return effect
    }

    export function AnimationFrames<A extends unknown[]>(
        link: Effects,
        callback: (...args: A) => void | Promise<void>,
        ...args: A
    ): Effect {
        let identifier: number
        function frame(): void {
            identifier = requestAnimationFrame(frame)
        }

        const effect = atEnd(link, async () => {
            cancelAnimationFrame()
        })
    }

    export function inScene(link: Effects, object: Three.Object3D, scene: Three.Scene): Effect {
        scene.add(object)
        return atEnd(link, () => scene.remove(object) as never)
    }
}

globalify({
    Timeout: module.Timeout,
    Interval: module.Interval,

    inScene: module.inScene,
})
