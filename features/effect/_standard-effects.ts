import globalify from 'sky/utilities/globalify'

declare global {
    function inArray<T>(source: T, target: T[], deps: EffectDeps): Effect

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

    class WindowEventListener<K extends keyof WindowEventMap, T> extends Effect {
        constructor(
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            deps: EffectDeps,
            options?: boolean | AddEventListenerOptions
        )
    }

    class DocumentEventListener<K extends keyof DocumentEventMap, T> extends Effect {
        constructor(
            type: K,
            listener: (this: Window, ev: DocumentEventMap[K]) => T,
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

function inArray<T>(source: T, target: T[], deps: EffectDeps): Effect {
    return new Effect(() => {
        target.push(source)
        return () => {
            target.remove(source)
        }
    }, deps)
}

class Timeout<T = void, A extends unknown[] = []> extends Effect {
    constructor(callback: (...args: A) => T, timeout: Time, deps: EffectDeps, ...args: A) {
        super(deps)

        const { destroy } = this

        const identifier = setTimeout(async () => {
            await callback(...args)
            await destroy.call(this)
        }, timeout.valueOf() * 1000)

        this.destroy = (): void => {
            clearTimeout(identifier)
        }
    }
}

class Interval<T> extends Effect {
    constructor(
        callback: (...args: unknown[]) => T,
        interval: Time,
        deps: EffectDeps,
        ...args: unknown[]
    ) {
        super(deps)

        const identifier = setInterval(async () => {
            await callback(...args)
        }, interval.valueOf() * 1000)

        this.destroy = (): void => {
            clearInterval(identifier)
        }
    }
}

class AnimationFrame<T> extends Effect {
    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        super(deps)

        const identifier = requestAnimationFrame(async () => await callback(...args))

        this.destroy = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class AnimationFrames<T> extends Effect {
    constructor(callback: (...args: unknown[]) => T, deps: EffectDeps, ...args: unknown[]) {
        super(deps)

        let identifier: number
        const frame = async (): Promise<void> => {
            await callback(...args)
            identifier = requestAnimationFrame(frame)
        }
        identifier = requestAnimationFrame(frame)

        this.destroy = (): void => {
            cancelAnimationFrame(identifier)
        }
    }
}

class WindowEventListener<K extends keyof WindowEventMap, T> extends Effect {
    constructor(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => T,
        deps: EffectDeps,
        options?: boolean | AddEventListenerOptions
    ) {
        super(deps)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        window.addEventListener(type, handle, options)
        this.destroy = (): void => {
            window.removeEventListener(type, handle, options)
        }
    }
}

class DocumentEventListener<K extends keyof DocumentEventMap, T> extends Effect {
    constructor(
        type: K,
        listener: (this: Window, ev: DocumentEventMap[K]) => T,
        deps: EffectDeps,
        options?: boolean | AddEventListenerOptions
    ) {
        super(deps)

        const handle = (...args: unknown[]): void => {
            ;(listener as Function).call(window, ...args)
        }

        document.addEventListener(type, handle, options)
        this.destroy = (): void => {
            document.removeEventListener(type, handle, options)
        }
    }
}

class PointerLock extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        document.body.requestPointerLock()
        this.destroy = (): void => {
            document.exitPointerLock()
        }
    }
}

class Fullscreen extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        document.body.requestFullscreen()
        this.destroy = (): void => {
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
