import globalify from '@sky-modules/core/globalify'

import Effect from '../../features/effect/Effect'
import EffectDep from '../../features/effect/EffectDep'
import Time from '../../utilities/Time'

declare global {
    function property<T>(
        main: unknown,
        target: T,
        key: keyof T,
        dep: EffectDep,
        parameters?: PropertyParameters
    ): Promise<Effect>
    function inArray<T>(source: T, target: T[], dep: EffectDep): Effect

    class Timeout<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, timeout: Time, dep: EffectDep, ...args: A[])
    }

    class Interval<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, interval: Time, dep: EffectDep, ...args: A)
    }

    class AnimationFrame<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, dep: EffectDep, ...args: A)
    }

    class AnimationFrames<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, dep: EffectDep, ...args: A)
    }

    class WindowEventListener<K extends keyof WindowEventMap, T> {
        readonly effect: Effect

        constructor(
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            dep: EffectDep,
            options?: boolean | AddEventListenerOptions
        )
    }

    class DocumentEventListener<K extends keyof DocumentEventMap, T> {
        readonly effect: Effect

        constructor(
            type: K,
            listener: (this: Window, ev: DocumentEventMap[K]) => T,
            dep: EffectDep,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock {
        readonly effect: Effect

        constructor(dep: EffectDep)
    }

    class Fullscreen {
        readonly effect: Effect

        constructor(dep: EffectDep)
    }
}

function default__getEffect(main: { effect: Effect }): Effect {
    return main.effect
}

interface PropertyParameters {
    getEffect(main: unknown): Effect
}
async function property<T>(
    main: unknown,
    target: T,
    key: PropertyKey,
    dep: EffectDep,
    parameters?: PropertyParameters
): Promise<Effect> {
    const getEffect = parameters?.getEffect ?? default__getEffect

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((target as any)[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effect = getEffect((target as any)[key])

        if (effect && !effect.disposed) {
            await effect.dispose()
        }
    }

    return new Effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(target as any)[key] = main

        return async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const effect = getEffect((target as any)[key])

            if (!effect.disposed) {
                await effect.dispose()
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (target as any)[key]
        }
    }, deps)
}

function inArray<T>(source: T, target: T[], dep: EffectDep): Effect {
    return new Effect(() => {
        target.push(source)
        return () => {
            target.remove(source)
        }
    }, deps)
}

class Timeout<T> {
    readonly effect: Effect

    constructor(
        callback: (...args: unknown[]) => T,
        timeout: Time,
        dep: EffectDep,
        ...args: unknown[]
    ) {
        this.effect = new Effect(dep, this)

        const identifier = setTimeout(() => {
            callback(...args)
        }, timeout.valueOf() * 1000)

        this.effect.dispose = (): void => {
            clearTimeout(identifier)
        }
    }
}

class Interval<T> {
    readonly effect: Effect

    constructor(
        callback: (...args: unknown[]) => T,
        interval: Time,
        dep: EffectDep,
        ...args: unknown[]
    ) {
        this.effect = new Effect(dep, this)

        const identifier = setInterval(() => {
            callback(...args)
        }, interval.valueOf() * 1000)

        this.effect.dispose = (): void => {
            clearInterval(identifier)
        }
    }
}

class AnimationFrame<T> {
    readonly effect: Effect

    constructor(callback: (...args: unknown[]) => T, dep: EffectDep, ...args: unknown[]) {
        this.effect = new Effect(dep, this)

        const identifier = requestAnimationFrame(() => callback(...args))

        this.effect.dispose = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class AnimationFrames<T> {
    readonly effect: Effect

    constructor(callback: (...args: unknown[]) => T, dep: EffectDep, ...args: unknown[]) {
        this.effect = new Effect(dep, this)

        let identifier: number
        const frame = (): void => {
            callback(...args)
            identifier = requestAnimationFrame(frame)
        }
        identifier = requestAnimationFrame(frame)

        this.effect.dispose = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class WindowEventListener<K extends keyof WindowEventMap, T> {
    readonly effect: Effect

    constructor(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => T,
        dep: EffectDep,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(dep, this)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        window.addEventListener(type, handle, options)
        this.effect.dispose = (): void => {
            window.removeEventListener(type, handle, options)
        }
    }
}

class DocumentEventListener<K extends keyof DocumentEventMap, T> {
    readonly effect: Effect

    constructor(
        type: K,
        listener: (this: Window, ev: DocumentEventMap[K]) => T,
        dep: EffectDep,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(dep, this)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        document.addEventListener(type, handle, options)
        this.effect.dispose = (): void => {
            document.removeEventListener(type, handle, options)
        }
    }
}

class PointerLock {
    readonly effect: Effect
    whenLocked?: Promise<void>

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.whenLocked = document.body.requestPointerLock()
        this.effect.dispose = (): void => {
            document.exitPointerLock()
        }
    }
}

class Fullscreen {
    readonly effect: Effect
    whenRequested?: Promise<void>

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.whenRequested = document.body.requestFullscreen()
        this.effect.dispose = async (): Promise<void> => {
            await document.exitFullscreen()
        }
    }
}

globalify({
    property,
    inArrayEffect: inArray,
    Timeout,
    Interval,
    AnimationFrame,
    AnimationFrames,
    WindowEventListener,
    DocumentEventListener,
    PointerLock,
    Fullscreen,
})
