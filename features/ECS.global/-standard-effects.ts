export {}

declare global {
    class Timeout<R> extends Effect<void | R> {
        constructor(
            link: Effects,
            callback: (...args: unknown[]) => R,
            timeout?: number,
            ...args: unknown[]
        )
    }

    class Interval<R> extends Effect<void | R> {
        constructor(
            link: Effects,
            callback: (...args: unknown[]) => R,
            interval?: number,
            ...args: unknown[]
        )
    }

    const AnimationFrame: <A extends unknown[], R>(
        link: Effects,
        callback: (...args: A) => R,
        ...args: A
    ) => Effect<void | R, []>

    const AnimationFrames: <A extends unknown[], R>(
        link: Effects,
        callback: (...args: A) => R,
        ...args: A
    ) => Effect<void | R, []>

    //@ts-ignore
    class EventListener<K extends keyof WindowEventMap, R> extends Effect {
        constructor(
            link: Effects,
            type: K,
            listener: (this: Window, ev: WindowEventMap[K]) => R,
            options?: boolean | AddEventListenerOptions
        )
    }

    class PointerLock extends Effect {
        constructor(link: Effects)
    }

    const Fullscreen: (link: Effects) => Effect
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

    export class PointerLock extends Effect {
        constructor(link: Effects) {
            super(link)

            document.body.requestPointerLock()
            this.dispose = async (): Promise<void> => document.exitPointerLock()
        }
    }

    export const Fullscreen = effect(() => {
        document.body.requestFullscreen()
        return (): void => document.exitFullscreen() as never
    })
}

Object.assign(global, module)
