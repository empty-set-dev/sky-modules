import globalify from 'sky/helpers/globalify'

import __signalOnDestroy from './__signalDestroyed'

declare global {
    class EffectsRoot extends lib.EffectsRoot {
        static groups: string[]

        get isDestroyed(): boolean

        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        addContext<T extends { constructor: Function }>(context: T): this
        removeContext<T extends { constructor: Function }>(context: T): this
        hasContext<T extends Context<T>>(Context: T): boolean
        context<T extends Context<T>>(Context: T): InstanceType<T>
        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

async function __destroy(this: EffectsRoot): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

let __uniqueId = 1

namespace lib {
    export class EffectsRoot {
        static groups: string[]

        readonly id: number

        constructor() {
            this.id = __uniqueId
            ++__uniqueId

            const Context = this.constructor as Context

            if (Context.context) {
                this.__contexts = {
                    [Context.name]: this,
                }
            }
        }

        get isDestroyed(): boolean {
            return this.__isDestroyed !== undefined
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

            if (!Context.context) {
                throw Error('class missing context property')
            }

            this.__contexts[Context.name] = context

            this.__links &&
                this.__links.forEach(link => {
                    link['__addContexts']({
                        [Context.name]: context,
                    })
                })

            return this
        }

        removeContext<T extends { constructor: Function }>(context: T): this {
            this.__contexts ??= {}
            const Context = context.constructor as Context

            if (!Context.context) {
                throw Error('class missing context property')
            }

            delete this.__contexts[Context.name]

            this.__links &&
                this.__links.forEach(link => {
                    link['__removeContexts']({ [Context.name]: context })
                })

            return this
        }

        hasContext<T extends Context<T>>(Context: T): boolean {
            if (!this.__contexts || !this.__contexts[Context.name]) {
                return false
            }

            return true
        }

        context<T extends Context<T>>(Context: T): InstanceType<T> {
            if (!this.__contexts || !this.__contexts[Context.name]) {
                throw new Error('context missing')
            }

            return this.__contexts[Context.name] as InstanceType<T>
        }

        emit<T extends []>(ev: string, ...args: T): this {
            if ((this as unknown as { [x: Object.Index]: Function })[`${ev}WithTransform`]) {
                ;(this as unknown as { [x: Object.Index]: Function })[ev](
                    (transform: (...args: T) => T) => {
                        args = transform(...args)
                    },
                    ...args
                )
            } else if ((this as unknown as { [x: Object.Index]: Function })[ev]) {
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

        private __isDestroyed: undefined | boolean
        private __contexts: undefined | Record<string, unknown>
        private __links: undefined | Effect[]
        private __effects: undefined | Effect[]
        private __groups: undefined | Record<number, unknown>
    }
}

globalify(lib)
