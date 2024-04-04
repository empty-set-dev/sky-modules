import __atEnd from './--atEnd'

declare global {
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
}

namespace module {
    export async function until<T, A extends unknown[]>(
        callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
        ...args: A
    ): Promise<T> {
        return new Promise(r => callback(r, ...args))
    }

    export function use<A extends unknown[], EffectR, EffectA extends unknown[]>(
        link: Effects,
        effect: (...args: A) => (...args: EffectA) => EffectR,
        ...args: A
    ): Effect<EffectR, EffectA> {
        return __atEnd(link, effect(...args))
    }

    export async function useAsync<EA extends unknown[], ER, A extends unknown[]>(
        link: Effects,
        effect: (...args: A) => Promise<(...args: EA) => ER>,
        ...args: A
    ): Promise<Effect<ER, EA>> {
        return __atEnd(link, await effect(...args))
    }
}

Object.assign(global, module)
