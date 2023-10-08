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

const ON_END = Symbol('OnEnd')

class Effects<R = void, A extends unknown[] = []> {
    readonly end: Promise<Awaited<R>>

    constructor() {
        this.end = new Promise<Awaited<R>>(
            r =>
                (this.resolve = (value: Awaited<R>): Promise<Awaited<R>> => {
                    r(value)
                    return this.end
                })
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async dispose(...args: A): Promise<Awaited<R>> {
        if (this[ON_END]) {
            for (let i = 0; i < this[ON_END].length; i++) {
                await this[ON_END][i]()
            }

            delete this[ON_END]
        }

        return this.resolve()
    }

    private resolve
}

abstract class Effect<R = void, A extends unknown[] = []> {
    readonly end: Promise<Awaited<R>>

    constructor(link: Effect) {
        link[ON_END] ??= []
        link[ON_END].push(this.dispose.bind(this))

        this.end = new Promise<Awaited<R>>(
            r =>
                (this.resolve = (value: Awaited<R>): Promise<Awaited<R>> => {
                    r(value)
                    return this.end
                })
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async dispose(...args: A): Promise<Awaited<R>> {
        if (this[ON_END]) {
            for (let i = 0; i < this[ON_END].length; i++) {
                await this[ON_END][i]()
            }
        }

        return this.end
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected resolve(value: Awaited<R>): Promise<Awaited<R>> {
        return this.end
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

    link[ON_END] ??= []
    link[ON_END].push(onEnd)

    return self as never
}

globalify({
    until,
    use,
    useAsync,
    atEnd,
    Effects,
    Effect,
})

//
declare global {
    const Timeout: typeof module.Timeout
    const Interval: typeof module.Interval
}

namespace module {
    export class Timeout<R> extends Effect<void | R> {
        constructor(
            link: Effect,
            callback: (...args: unknown[]) => R,
            timeout?: number,
            ...args: unknown[]
        ) {
            super(link)

            this['__timeout'] = setTimeout(async () => {
                this.resolve(await callback(...args))
                super.dispose()
            }, timeout) as never as NodeJS.Timeout
        }

        async dispose(): Promise<void | Awaited<R>> {
            await super.dispose()

            clearTimeout(this['__timeout'])

            console.log('clear...')

            return this.resolve()
        }

        private __timeout: NodeJS.Timeout
    }

    export class Interval<R> extends Effect<void | R> {
        constructor(
            link: Effect,
            callback: (...args: unknown[]) => R,
            interval?: number,
            ...args: unknown[]
        ) {
            super(link)

            this['__interval'] = setInterval(async () => {
                this.resolve(await callback(...args))
            }, interval) as never as NodeJS.Timeout
        }

        async dispose(): Promise<void | Awaited<R>> {
            await super.dispose()

            clearInterval(this['__interval'])

            return this.resolve()
        }

        private __interval: NodeJS.Timeout
    }
}

globalify({
    Timeout: module.Timeout,
    Interval: module.Interval,
})

const effects = new Effects()
const timeout = new Timeout(
    effects,
    () => {
        console.log('timeout')

        return 42
    },
    1000
)

await effects.dispose()

console.log(await timeout.end)
