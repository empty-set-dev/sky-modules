import globalify from 'helpers/globalify'

import {
    __CONTEXT_ON,
    __CONTEXT_OFF,
    __DESTROY,
    __EVENTS,
    __LINKS,
    __LINKS_COUNT,
    __EFFECTS,
} from './__'
import __signalOnDestroy from './__signalOnDestroy'

declare global {
    class Parent {
        constructor(...parents: Parent[])
        addLinks(...links: Link<unknown, unknown[]>[]): this
    }

    class Root<T = void, A extends unknown[] = []> extends Parent {
        constructor()
        destroy(...args: A): Promise<T>
    }
}

async function __destroy<T, A extends unknown[]>(
    this: globalThis.Link<T, A>,
    ...args: A
): Promise<Awaited<T>> {
    __signalOnDestroy(this)
    return await this[__DESTROY](...args)
}

class Root<T = void, A extends unknown[] = []> {
    get destroy(): (...args: [] | A) => Promise<Awaited<T>> {
        return __destroy
    }

    set destroy(
        destroy: (
            nextDestroy: (...args: A) => Promise<Awaited<T>>,
            ...args: A
        ) => Promise<Awaited<T>>
    ) {
        const originalDestroy = this[__DESTROY]
        this[__DESTROY] = (...args: A): Promise<Awaited<T>> => {
            return destroy(originalDestroy, ...args)
        }
    }

    addLinks(...links: Link[]): this {
        links.forEach(link => {
            ++link[__LINKS_COUNT]
        })

        this[__LINKS] ??= []
        this[__LINKS].push(...links)

        return this
    }

    on(ev: Object.Index, callback: Function, links: Root<unknown, unknown[]>[]): this {
        this[__EVENTS] ??= {}
        const eventsList = (this[__EVENTS][ev] ??= [])

        new Effect(() => {
            eventsList.push(callback)

            return async () => {
                eventsList.remove(callback)
            }
        }, [this, ...links])

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

    private async [__DESTROY](...args: [] | A): Promise<Awaited<T>>
    private async [__DESTROY](): Promise<Awaited<T>> {
        if (!this[__LINKS]) {
            return
        }

        await Promise.all(
            this[__LINKS].map(link =>
                (async (): Promise<void> => {
                    --link[__LINKS_COUNT]

                    if (link[__LINKS_COUNT] > 0) {
                        return
                    }

                    await __destroy.call(link)
                })()
            )
        )

        delete this[__LINKS]
    }

    private [__EFFECTS]?: Effect[]
    private [__LINKS]?: Link[]
    private [__EVENTS]?: Record<Object.Index, Function[]>
}

globalify({ Root })
