import globalify from 'sky/helpers/globalify'

import {
    __DESTROY,
    __LINKS,
    __LINKS_COUNT,
    __EFFECTS,
    __IS_DESTROYED,
    __CONTEXTS,
    __CONTEXTS_EFFECTS,
    __PARENTS,
    __DEPS,
} from './__'
import __signalOnDestroy from './__signalDestroyed'

declare global {
    class Root {
        constructor()
        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        hasContext<T extends Context>(Context: T): boolean
        context<T extends Context>(parent: T): InstanceType<T>
        initContext<T extends Context>(context: T, contextValue: InstanceType<T>): this
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

    hasContext<T extends Context>(Context: T): boolean {
        if (!this[__CONTEXTS]) {
            return false
        }

        if (!this[__CONTEXTS][Context.context]) {
            return false
        }

        return true
    }

    context<T extends Context>(Context: T): InstanceType<T> {
        if (!this[__CONTEXTS]) {
            throw new Error('context missing')
        }

        return this[__CONTEXTS][Context.context]
    }

    initContext<T extends Context>(context: T, contextValue: InstanceType<T>): this {
        this[__CONTEXTS][context.context] = contextValue

        return this
    }

    emit(ev: Object.Index, ...args: unknown[]): this {
        if (this[ev]) {
            this[ev](...args)
        }

        if (!this[__LINKS]) {
            return this
        }

        this[__LINKS].forEach(link => link.emit(ev, ...args))

        return this
    }

    private async [__DESTROY](): Promise<void> {
        if (this[__PARENTS]) {
            this[__PARENTS].forEach(parentLink => {
                if (parentLink[__IS_DESTROYED] === undefined) {
                    parentLink[__LINKS].remove(this)
                }
            })
        }

        if (this[__DEPS]) {
            const contextOwner = this[__DEPS][0] as Root
            this[__DEPS].forEach(dep => {
                if (typeof dep.context !== 'symbol') {
                    if (dep[__IS_DESTROYED] === undefined) {
                        dep[__EFFECTS].remove(this)
                    }
                } else {
                    if (contextOwner[__IS_DESTROYED] === undefined) {
                        contextOwner[__CONTEXTS_EFFECTS]![dep.context].remove(this)
                    }
                }
            })
        }

        if (this[__LINKS]) {
            await Promise.all(
                this[__LINKS].map(link =>
                    (async (): Promise<void> => {
                        --link[__LINKS_COUNT]

                        if (link[__LINKS_COUNT] > 0) {
                            link[__PARENTS].remove(this)

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

    private [__LINKS]?: Effect[]
    private [__EFFECTS]?: Effect[]
    private [__CONTEXTS_EFFECTS]?: Record<symbol, Effect[]>
}

globalify({ Root })
