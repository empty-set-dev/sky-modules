import globalify from 'helpers/globalify'

declare global {
    class Timeout<T> extends Effect<void | T> {
        constructor(
            link: Link,
            callback: (...args: unknown[]) => T,
            timeout?: number,
            ...args: unknown[]
        )
    }

    class Interval<T> extends Effect<void | T> {
        constructor(
            link: Link,
            callback: (...args: unknown[]) => T,
            interval?: number,
            ...args: unknown[]
        )
    }

    const AnimationFrame: <A extends unknown[], T>(
        link: Link,
        callback: (...args: A) => T,
        ...args: A
    ) => Effect<void | T, []>

    const AnimationFrames: <A extends unknown[], T>(
        link: Link,
        callback: (...args: A) => T,
        ...args: A
    ) => Effect<void | T, []>

    //@ts-ignore
    class EventListener<K extends keyof WindowEventMap, T> extends Effect {
        constructor(
            link: Link,
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => T,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock extends Effect {
        constructor(link: Link)
    }

    const Fullscreen: (link: Link) => Effect
}

class Timeout<T> extends Effect<void | T> {
    constructor(
        parents: Parent[],
        callback: (...args: unknown[]) => T,
        timeout?: number,
        ...args: unknown[]
    ) {
        super(parents)

        const { dispose } = this

        const identifier = setTimeout(async () => {
            this.resolve(await callback(...args))
            await dispose.call(this)
        }, timeout)

        this.dispose = async (nextDispose): Promise<void | Awaited<T>> => {
            clearTimeout(identifier)

            await nextDispose()
        }
    }
}

class Interval<T> extends Effect<void | T> {
    constructor(
        link: Link,
        callback: (...args: unknown[]) => T,
        interval?: number,
        ...args: unknown[]
    ) {
        super(link)

        const identifier = setInterval(async () => {
            this.resolve(await callback(...args))
        }, interval)

        this.dispose = async (nextDispose): Promise<void | Awaited<T>> => {
            clearInterval(identifier)

            await nextDispose()
        }
    }
}

class AnimationFrame<T> extends Effect<void | T> {
    constructor(link: Link, callback: (...args: unknown[]) => T, ...args: unknown[]) {
        super(link)

        const identifier = requestAnimationFrame(async () => this.resolve(await callback(...args)))

        this.dispose = async (nextDispose): Promise<void | Awaited<T>> => {
            cancelAnimationFrame(identifier)

            await nextDispose()
        }
    }
}

class AnimationFrames<T> extends Effect<void | T> {
    constructor(link: Link, callback: (...args: unknown[]) => T, ...args: unknown[]) {
        super(link)

        let identifier
        const frame = async (): Promise<void> => {
            this.resolve(await callback(...args))
            identifier = requestAnimationFrame(frame)
        }
        identifier = requestAnimationFrame(frame)

        this.dispose = async (nextDispose): Promise<void | Awaited<T>> => {
            cancelAnimationFrame(identifier)

            await nextDispose()
        }
    }
}

class EventListener<K extends keyof WindowEventMap, T> extends Effect {
    constructor(
        link: Link,
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => T,
        options?: boolean | AddEventListenerOptions
    ) {
        super(link)

        const handle = (...args): void => {
            this.resolve(listener.call(this, ...args))
        }

        addEventListener(type, handle, options)
        this.dispose = async (nextDispose): Promise<void> => {
            removeEventListener(type, handle, options) as never

            await nextDispose()
        }
    }
}

class PointerLock extends Effect {
    constructor(link: Link) {
        super(link)

        document.body.requestPointerLock()
        this.dispose = async (): Promise<void> => document.exitPointerLock()
    }
}

class Fullscreen extends Effect {
    constructor(link: Link) {
        super(link)

        document.body.requestFullscreen()
        this.dispose = async (): Promise<void> => document.exitFullscreen()
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
