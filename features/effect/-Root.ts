import globalify from 'sky/helpers/globalify'

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
    return await this['__destroy']()
}

class Root {
    constructor() {
        const contextName = this.constructor['context']

        if (contextName) {
            this.__contexts = {
                [contextName]: this,
            }
        }
    }

    get isDestroyed(): boolean {
        return !!this.__isDestroyed
    }

    get destroy(): () => Promise<void> {
        return __destroy
    }

    set destroy(destroy: () => void | Promise<void>) {
        const originalDestroy = this.__destroy
        this.__destroy = async (): Promise<void> => {
            if (this.isDestroyed) {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    hasContext<T extends Context>(Context: T): boolean {
        if (!this.__contexts) {
            return false
        }

        if (!this.__contexts[Context.context]) {
            return false
        }

        return true
    }

    context<T extends Context>(Context: T): InstanceType<T> {
        if (!this.__contexts || !this.__contexts[Context.context]) {
            throw new Error('context missing')
        }

        return this.__contexts[Context.context] as InstanceType<T>
    }

    addContext<T extends Context>(Context: T, contextValue: InstanceType<T>): this {
        this.__contexts ??= {}

        const contextName = Context.context
        const context = this.__contexts[contextName]

        if (Array.isArray(context)) {
            const contexts = context
            contexts.push(contextValue as never)
        } else if (context) {
            const contexts = (this.__contexts[contextName] = [context])
            contexts.push(contextValue as never)
        } else {
            this.__contexts[contextName] = contextValue as Root
        }

        return this
    }

    emit(ev: Object.Index, ...args: unknown[]): this {
        if (this[ev]) {
            this[ev](...args)
        }

        if (!this.__links) {
            return this
        }

        this.__links.forEach(link => link.emit(ev, ...args))

        return this
    }

    private async __destroy(): Promise<void> {
        if (this.__parents) {
            this.__parents.forEach(parent => {
                if (parent['__isDestroyed'] === undefined) {
                    parent.__links.remove(this)
                }
            })
        }

        if (this.__depends) {
            const contextOwner = this.__parents[0]
            this.__depends.forEach(dep => {
                if (typeof dep.context !== 'string') {
                    if (dep['__isDestroyed'] === undefined) {
                        dep['__effects'].remove(this)
                    }
                } else {
                    if (contextOwner['__isDestroyed'] === undefined) {
                        contextOwner['__contextEffects']![dep['context']].remove(this)
                    }
                }
            })
        }

        if (this.__links) {
            await Promise.all(
                this.__links.map(link =>
                    (async (): Promise<void> => {
                        --link['__linksCount']

                        if (link['__linksCount'] > 0) {
                            link['__parents'].remove(this)

                            if (this.__contexts) {
                                link['__removeContexts'](this.__contexts)
                            }
                        } else {
                            await link.destroy()
                        }
                    })()
                )
            )
        }

        if (this.__effects) {
            await Promise.all(
                this.__effects.map(effect => {
                    if (effect['__isDestroyed']) {
                        return
                    }

                    ;(async (): Promise<void> => {
                        await effect.destroy()
                    })()
                })
            )
        }

        this.__isDestroyed = true
    }

    private __isDestroyed?: boolean
    private __parents?: Root[]
    private __links?: Effect[]
    private __depends?: Root[]
    private __effects?: Effect[]
    private __contexts?: Record<string, Root | Root[]>
    private __contextEffects?: Record<string, Effect[]>
}

globalify({ Root })
