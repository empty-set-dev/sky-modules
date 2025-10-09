import globalify from '@sky-modules/core/globalify'

declare global {
    function property<T>(
        main: unknown,
        target: T,
        key: keyof T,
        deps: EffectDep,
        parameters?: PropertyParameters
    ): Promise<Effect>
    function inArrayEffect<T>(source: T, target: T[], deps: EffectDep): Effect

    class Timeout<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, timeout: Time, deps: EffectDep, ...args: A[])
    }

    class Interval<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, interval: Time, deps: EffectDep, ...args: A)
    }

    class AnimationFrame<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, deps: EffectDep, ...args: A)
    }

    class AnimationFrames<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, deps: EffectDep, ...args: A)
    }

    class WindowEventListener<K extends keyof WindowEventMap, T> {
        readonly effect: Effect

        constructor(
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            deps: EffectDep,
            options?: boolean | AddEventListenerOptions
        )
    }

    class DocumentEventListener<K extends keyof DocumentEventMap, T> {
        readonly effect: Effect

        constructor(
            type: K,
            listener: (this: Window, ev: DocumentEventMap[K]) => T,
            deps: EffectDep,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock {
        readonly effect: Effect

        constructor(deps: EffectDep)
    }

    class Fullscreen {
        readonly effect: Effect

        constructor(deps: EffectDep)
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
    deps: EffectDep,
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

function inArray<T>(source: T, target: T[], deps: EffectDep): Effect {
    return new Effect(() => {
        target.push(source)
        return () => {
            target.remove(source)
        }
    }, deps)
}

class Interval<T> {
    readonly effect: Effect

    constructor(
        callback: (...args: unknown[]) => T,
        interval: Time,
        deps: EffectDep,
        ...args: unknown[]
    ) {
        this.effect = new Effect(deps, this)

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

    constructor(callback: (...args: unknown[]) => T, deps: EffectDep, ...args: unknown[]) {
        this.effect = new Effect(deps, this)

        const identifier = requestAnimationFrame(() => callback(...args))

        this.effect.dispose = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class AnimationFrames<T> {
    readonly effect: Effect

    constructor(callback: (...args: unknown[]) => T, deps: EffectDep, ...args: unknown[]) {
        this.effect = new Effect(deps, this)

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
        deps: EffectDep,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(deps, this)

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
        deps: EffectDep,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(deps, this)

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

    constructor(deps: EffectDep) {
        this.effect = new Effect(deps, this)

        this.whenLocked = document.body.requestPointerLock()
        this.effect.dispose = (): void => {
            document.exitPointerLock()
        }
    }
}

class Fullscreen {
    readonly effect: Effect
    whenRequested?: Promise<void>

    constructor(deps: EffectDep) {
        this.effect = new Effect(deps, this)

        this.whenRequested = document.body.requestFullscreen()
        this.effect.dispose = async (): Promise<void> => {
            await document.exitFullscreen()
        }
    }
}

globalify({
    property,
    inArray,
    Timeout,
    Interval,
    AnimationFrame,
    AnimationFrames,
    WindowEventListener,
    DocumentEventListener,
    PointerLock,
    Fullscreen,
})
