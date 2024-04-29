import globalify from 'helpers/globalify'

import {
    __DESTROY,
    __EVENTS,
    __LINKS,
    __LINKS_COUNT,
    __EFFECTS,
    __IS_DESTROYED,
    __CONTEXTS,
    __CONTEXTS_EFFECTS,
} from './__'
import __signalOnDestroy from './__signalDestroyed'

declare global {
    interface Parent extends Root {}

    class Root {
        constructor()
        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        context<T extends { new (...args: unknown[]): unknown; context: Symbol }>(
            parent: T
        ): InstanceType<T>
        on(ev: Object.Index, callback: Function, deps: EffectDeps): this
        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

async function __destroy(this: Root): Promise<void> {
    __signalOnDestroy(this)
    return await this[__DESTROY]()
}

class Root {
    constructor() {
        if (this.constructor['context']) {
            this[__CONTEXTS] = {
                [this.constructor['context']]: this,
            }
        }
    }

    get isDestroyed(): boolean {
        return !!this[__IS_DESTROYED]
    }

    get destroy(): () => Promise<void> {
        return __destroy
    }

    set destroy(destroy: () => void | Promise<void>) {
        const originalDestroy = this[__DESTROY]
        this[__DESTROY] = async (): Promise<void> => {
            if (this.isDestroyed) {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    context<T extends { new (...args: unknown[]): unknown; context: Symbol }>(
        parent: T
    ): InstanceType<T> {
        return this[__CONTEXTS][parent.context]
    }

    on(ev: Object.Index, callback: Function, links: EffectDeps): this {
        this[__EVENTS] ??= {}
        const eventsList = (this[__EVENTS][ev] ??= [])

        new Effect(() => {
            eventsList.push(callback)

            return async () => {
                eventsList.remove(callback)
            }
        }, [this as Parent, ...links])

        return this
    }

    emit(ev: Object.Index, ...args: unknown[]): this {
        if (!this[__EVENTS]) {
            return
        }

        const eventsList = this[__EVENTS][ev]
        eventsList && eventsList.forEach(cb => cb(...args))

        return this
    }

    private async [__DESTROY](): Promise<void> {
        if (this[__LINKS]) {
            await Promise.all(
                this[__LINKS].map(link =>
                    (async (): Promise<void> => {
                        --link[__LINKS_COUNT]

                        if (link[__LINKS_COUNT] > 0) {
                            if (this[__CONTEXTS]) {
                                link['__removeContext'](this[__CONTEXTS])
                            }

                            return
                        }

                        await link.destroy()
                    })()
                )
            )
        }

        if (this[__EFFECTS]) {
            await Promise.all(
                this[__EFFECTS].map(effect =>
                    (async (): Promise<void> => {
                        await effect.destroy()
                    })()
                )
            )
        }

        this[__IS_DESTROYED] = true
    }

    private [__EFFECTS]?: Effect[]
    private [__LINKS]?: Link[]
    private [__CONTEXTS_EFFECTS]?: Record<symbol, Effect[]>
    private [__EVENTS]?: Record<Object.Index, Function[]>
}

globalify({ Root })
