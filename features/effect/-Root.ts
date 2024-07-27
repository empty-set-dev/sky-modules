import globalify from 'sky/helpers/globalify'

import {
    __DestroySymbol,
    __LinksSymbol,
    __LinksCountSymbol,
    __EffectsSymbol,
    __IsDestroyedSymbol,
    __ContextsSymbol,
    __ContextEffectsSymbol,
    __ParentsSymbol,
    __DepsSymbol,
} from './__'
import __signalOnDestroy from './__signalDestroyed'

declare global {
    class Root {
        constructor()
        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        hasContext<T extends Context>(Context: T): boolean
        context<T extends Context>(parent: T): InstanceType<T>
        addContext<T extends Context>(context: T, contextValue: InstanceType<T>): this
        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

async function __destroy(this: Root): Promise<void> {
    __signalOnDestroy(this)
    return await this[__DestroySymbol]()
}

class Root {
    constructor() {
        if (this.constructor['context']) {
            this[__ContextsSymbol] = {
                [this.constructor['context']]: this,
            }
        }
    }

    get isDestroyed(): boolean {
        return !!this[__IsDestroyedSymbol]
    }

    get destroy(): () => Promise<void> {
        return __destroy
    }

    set destroy(destroy: () => void | Promise<void>) {
        const originalDestroy = this[__DestroySymbol]
        this[__DestroySymbol] = async (): Promise<void> => {
            if (this.isDestroyed) {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    hasContext<T extends Context>(Context: T): boolean {
        if (!this[__ContextsSymbol]) {
            return false
        }

        if (!this[__ContextsSymbol][Context.context]) {
            return false
        }

        return true
    }

    context<T extends Context>(Context: T): InstanceType<T> {
        if (!this[__ContextsSymbol] || !this[__ContextsSymbol][Context.context]) {
            throw new Error('context missing')
        }

        return this[__ContextsSymbol][Context.context]
    }

    addContext<T extends Context>(context: T, contextValue: InstanceType<T>): this {
        this[__ContextsSymbol] ??= {}

        if (Array.isArray(this[__ContextsSymbol][context.context])) {
            this[__ContextsSymbol][context.context].push(contextValue)
        } else if (this[__ContextsSymbol][context.context]) {
            this[__ContextsSymbol][context.context] = [this[__ContextsSymbol][context.context]]
            this[__ContextsSymbol][context.context].push(contextValue)
        } else {
            this[__ContextsSymbol][context.context] = contextValue
        }

        return this
    }

    emit(ev: Object.Index, ...args: unknown[]): this {
        if (this[ev]) {
            this[ev](...args)
        }

        if (!this[__LinksSymbol]) {
            return this
        }

        this[__LinksSymbol].forEach(link => link.emit(ev, ...args))

        return this
    }

    private async [__DestroySymbol](): Promise<void> {
        if (this[__ParentsSymbol]) {
            this[__ParentsSymbol].forEach(parent => {
                if (parent[__IsDestroyedSymbol] === undefined) {
                    parent[__LinksSymbol].remove(this)
                }
            })
        }

        if (this[__DepsSymbol]) {
            const contextOwner = this[__DepsSymbol][0] as Root
            this[__DepsSymbol].forEach(dep => {
                if (typeof dep.context !== 'string') {
                    if (dep[__IsDestroyedSymbol] === undefined) {
                        dep[__EffectsSymbol].remove(this)
                    }
                } else {
                    if (contextOwner[__IsDestroyedSymbol] === undefined) {
                        contextOwner[__ContextEffectsSymbol]![dep.context].remove(this)
                    }
                }
            })
        }

        if (this[__LinksSymbol]) {
            await Promise.all(
                this[__LinksSymbol].map(link =>
                    (async (): Promise<void> => {
                        --link[__LinksCountSymbol]

                        if (link[__LinksCountSymbol] > 0) {
                            link[__ParentsSymbol].remove(this)

                            if (this[__ContextsSymbol]) {
                                link['__removeContexts'](this[__ContextsSymbol])
                            }
                        } else {
                            await link.destroy()
                        }
                    })()
                )
            )
        }

        if (this[__EffectsSymbol]) {
            await Promise.all(
                this[__EffectsSymbol].map(effect => {
                    if (effect[__IsDestroyedSymbol]) {
                        return
                    }

                    ;(async (): Promise<void> => {
                        await effect.destroy()
                    })()
                })
            )
        }

        this[__IsDestroyedSymbol] = true
    }

    private [__LinksSymbol]?: Effect[]
    private [__EffectsSymbol]?: Effect[]
    private [__ContextEffectsSymbol]?: Record<string, Effect[]>
}

globalify({ Root })
