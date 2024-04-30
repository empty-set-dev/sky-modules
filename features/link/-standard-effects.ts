import globalify from 'helpers/globalify'

declare global {
    class Timeout<T = void, A extends unknown[] = []> extends Effect {
        constructor(callback: (...args: A) => T, timeout: number, deps: EffectDeps, ...args: A[])
    }

    class Interval<T = void, A extends unknown[] = []> extends Effect {
        constructor(callback: (...args: A) => T, interval: number, deps: EffectDeps, ...args: A)
    }

    class AnimationFrame<T = void, A extends unknown[] = []> extends Effect {
        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A)
    }

    class AnimationFrames<T = void, A extends unknown[] = []> extends Effect {
        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A)
    }

    //@ts-ignore
    class EventListener<K extends keyof WindowEventMap, T> extends Effect {
        constructor(
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            deps: EffectDeps,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock extends Effect {
        constructor(deps: EffectDeps)
    }

    class Fullscreen extends Effect {
        constructor(deps: EffectDeps)
    }
}

class Timeout<T = void, A extends unknown[] = []> extends Effect {
    constructor(callback: (...args: A) => T, timeout: number, deps: EffectDeps, ...args: A) {
        super(deps)

        const { destroy } = this

        const identifier = setTimeout(async () => {
            await callback(...args)
            await destroy.call(this)
        }, timeout)
        this.destroy = async (): Promise<void> => {
            clearTimeout(identifier)
        }
    }
}

class Interval<T> extends Effect {
    constructor(
        callback: (...args: unknown[]) => T,
        interval: number,
        deps: EffectDeps,
        ...args: unknown[]
    ) {
        super(deps)

        const identifier = setInterval(async () => {
            await callback(...args)
        }, interval)

        this.destroy = async (): Promise<void> => {
            clearInterval(identifier)
        }
    }
}

class AnimationFrame<T> extends Effect {
    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        super(deps)

        const identifier = requestAnimationFrame(async () => await callback(...args))
        this.destroy = async (): Promise<void> => {
            cancelAnimationFrame(identifier)
        }
    }
}

class AnimationFrames<T> extends Effect {
    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        super(deps)

        let identifier
        const frame = async (): Promise<void> => {
            await callback(...args)
            identifier = requestAnimationFrame(frame)
        }
        identifier = requestAnimationFrame(frame)
        this.destroy = async (): Promise<void> => {
            cancelAnimationFrame(identifier)
        }
    }
}

class EventListener<K extends keyof WindowEventMap, T> extends Effect {
    constructor(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => T,
        deps: EffectDeps,
        options?: boolean | AddEventListenerOptions
    ) {
        super(deps)

        const handle = (...args): void => {
            listener.call(this, ...args)
        }

        addEventListener(type, handle, options)
        this.destroy = async (): Promise<void> => {
            removeEventListener(type, handle, options) as never
        }
    }
}

class PointerLock extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        document.body.requestPointerLock()
        this.destroy = async (): Promise<void> => {
            document.exitPointerLock()
        }
    }
}

class Fullscreen extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        document.body.requestFullscreen()
        this.destroy = async (): Promise<void> => document.exitFullscreen()
    }
}

globalify({
    Timeout,
    Interval,
    AnimationFrame,
    AnimationFrames,
    EventListener,
    PointerLock,
    Fullscreen,
})
