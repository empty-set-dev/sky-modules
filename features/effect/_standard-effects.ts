import globalify from 'sky/utilities/globalify'

declare global {
    function inArray<T>(source: T, target: T[], deps: EffectDeps): Effect

    class Timeout<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, timeout: number, deps: EffectDeps, ...args: A[])
    }

    class Interval<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, interval: number, deps: EffectDeps, ...args: A)
    }

    class AnimationFrame<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A)
    }

    class AnimationFrames<T = void, A extends unknown[] = []> {
        readonly effect: Effect

        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A)
    }

    class WindowEventListener<K extends keyof WindowEventMap, T> {
        readonly effect: Effect

        constructor(
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            deps: EffectDeps,
            options?: boolean | AddEventListenerOptions
        )
    }

    class DocumentEventListener<K extends keyof DocumentEventMap, T> {
        readonly effect: Effect
        constructor(
            type: K,
            listener: (this: Window, ev: DocumentEventMap[K]) => T,
            deps: EffectDeps,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock {
        readonly effect: Effect

        constructor(deps: EffectDeps)
    }

    class Fullscreen {
        readonly effect: Effect

        constructor(deps: EffectDeps)
    }
}

function inArray<T>(source: T, target: T[], deps: EffectDeps): Effect {
    return new Effect(() => {
        target.push(source)
        return () => {
            target.remove(source)
        }
    }, deps)
}

class Timeout<T = void, A extends unknown[] = []> {
    readonly effect: Effect

    constructor(callback: (...args: A) => T, timeout: Time, deps: EffectDeps, ...args: A) {
        this.effect = new Effect(deps, this)

        const { destroy } = this.effect

        const identifier = setTimeout(async () => {
            await callback(...args)
            await destroy.call(this.effect)
        }, timeout.valueOf() * 1000)

        this.effect.destroy = (): void => {
            clearTimeout(identifier)
        }
    }
}

class Interval<T> {
    readonly effect: Effect

    constructor(
        callback: (...args: unknown[]) => T,
        interval: Time,
        deps: EffectDeps,
        ...args: unknown[]
    ) {
        this.effect = new Effect(deps, this)

        const identifier = setInterval(async () => {
            await callback(...args)
        }, interval.valueOf() * 1000)

        this.effect.destroy = (): void => {
            clearInterval(identifier)
        }
    }
}

class AnimationFrame<T> {
    readonly effect: Effect

    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        this.effect = new Effect(deps, this)

        const identifier = requestAnimationFrame(async () => await callback(...args))

        this.effect.destroy = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class AnimationFrames<T> {
    readonly effect: Effect

    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        this.effect = new Effect(deps, this)

        let identifier: number
        const frame = async (): Promise<void> => {
            await callback(...args)
            identifier = requestAnimationFrame(frame)
        }
        identifier = requestAnimationFrame(frame)

        this.effect.destroy = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class WindowEventListener<K extends keyof WindowEventMap, T> {
    readonly effect: Effect

    constructor(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => T,
        deps: EffectDeps,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(deps, this)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        window.addEventListener(type, handle, options)
        this.effect.destroy = (): void => {
            window.removeEventListener(type, handle, options)
        }
    }
}

class DocumentEventListener<K extends keyof DocumentEventMap, T> {
    readonly effect: Effect

    constructor(
        type: K,
        listener: (this: Window, ev: DocumentEventMap[K]) => T,
        deps: EffectDeps,
        options?: boolean | AddEventListenerOptions
    ) {
        this.effect = new Effect(deps, this)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        document.addEventListener(type, handle, options)
        this.effect.destroy = (): void => {
            document.removeEventListener(type, handle, options)
        }
    }
}

class PointerLock {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)

        document.body.requestPointerLock()
        this.effect.destroy = (): void => {
            document.exitPointerLock()
        }
    }
}

class Fullscreen {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)

        document.body.requestFullscreen()
        this.effect.destroy = (): void => {
            document.exitFullscreen()
        }
    }
}

globalify({
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
