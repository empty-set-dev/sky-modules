import globalify from 'sky/helpers/globalify'

import __signalOnDestroy from './__signalDestroyed'

declare global {
    class EffectsRoot extends lib.EffectsRoot {
        get isDestroyed(): boolean

        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        addContext<T extends { constructor: Function }>(context: T): this
        removeContext<T extends { constructor: Function }>(context: T): this
        hasContext<T extends Context>(Context: T): boolean
        context<T extends Context>(Context: T): InstanceType<T>
        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

async function __destroy(this: EffectsRoot): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

namespace lib {
    export class EffectsRoot {
        constructor() {
            const Context = this.constructor as Context
            const contextName = Context.context

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

        addContext<T extends { constructor: Function }>(context: T): this {
            this.__contexts ??= {}
            const Context = context.constructor as Context
            const contextName = Context.context

            if (!contextName) {
                throw Error('class missing context property')
            }

            this.__contexts[contextName] = context

            this.__links &&
                this.__links.forEach(link => {
                    link['__addContexts']({
                        [contextName]: context,
                    })
                })

            return this
        }

        removeContext<T extends { constructor: Function }>(context: T): this {
            this.__contexts ??= {}
            const Context = context.constructor as Context
            const contextName = Context.context

            if (!contextName) {
                throw Error('class missing context property')
            }

            delete this.__contexts[contextName]

            this.__links &&
                this.__links.forEach(link => {
                    link['__removeContexts']({ [contextName]: context })
                })

            return this
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

        emit(ev: Object.Index, ...args: unknown[]): this {
            if ((this as unknown as { [x: Object.Index]: Function })[ev]) {
                ;(this as unknown as { [x: Object.Index]: Function })[ev](...args)
            }

            if (!this.__links) {
                return this
            }

            this.__links.forEach(link => link.emit(ev, ...args))

            return this
        }

        private async __destroy(): Promise<void> {
            if (this.__links) {
                this.__links &&
                    (await Promise.all(
                        this.__links.map(link =>
                            (async (): Promise<void> => {
                                link['__parents'].remove(this)

                                if (link['__parents'].length > 0) {
                                    if (this.__contexts) {
                                        link['__removeContexts'](this.__contexts)
                                    }
                                } else {
                                    await link.destroy()
                                }
                            })()
                        )
                    ))
            }

            this.__effects &&
                (await Promise.all(
                    this.__effects.map(effect => {
                        if (effect['__isDestroyed'] !== undefined) {
                            return
                        }

                        ;(async (): Promise<void> => {
                            await effect.destroy()
                        })()
                    })
                ))

            this.__isDestroyed = true
        }

        private __isDestroyed?: boolean
        private __contexts?: Record<string, unknown>
        private __links?: Effect[]
        private __effects?: Effect[]
    }
}

globalify(lib)
