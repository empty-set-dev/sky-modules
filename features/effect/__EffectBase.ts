import __signalOnDestroy from './__signalOnDestroy'

let __uniqueId = 1

async function destroy(this: __EffectBase): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

export default abstract class __EffectBase {
    readonly id: number
    readonly main?: { root: EffectsRoot } | { effect: Effect }

    private __stateOfDestroy: undefined | 'destroying' | 'destroyed'
    private __children: undefined | Effect[]
    private __contexts: undefined | Record<string, unknown>
    private __effects: undefined | Effect[]

    constructor(main?: { root: EffectsRoot } | { effect: Effect }) {
        this.id = __uniqueId++

        if (main != null) {
            this.main = main
        }

        const Context = main?.constructor as Context & { __name: string }

        if (Context && Context.context) {
            if (Context.__name == null) {
                if (Context.name.startsWith('__')) {
                    Context.__name = Context.name.slice(2)
                } else if (Context.name.startsWith('_')) {
                    Context.__name = Context.name.slice(1)
                } else {
                    Context.__name = Context.name
                }
            }

            this.__contexts = {
                [Context.__name]: main,
            }
        }
    }

    get isDestroyed(): boolean {
        return this.__stateOfDestroy !== undefined
    }

    get destroy(): () => Promise<void> {
        return destroy
    }

    set destroy(destroy: () => void | Promise<void>) {
        const originalDestroy = this.__destroy
        this.__destroy = async (): Promise<void> => {
            if (this.__stateOfDestroy === 'destroyed') {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    addContext<T extends Context>(context: T): this {
        const Context = context.constructor as Context & { __name: string }

        if (Context.context == null) {
            throw Error('class missing context property')
        }

        this.__contexts ??= {}

        this.__contexts[Context.__name] = context

        this.__children &&
            this.__children.forEach(child => {
                child['__addContexts']({
                    [Context.__name]: context,
                })
            })

        return this
    }

    removeContext<T extends { constructor: Function }>(context: T): this {
        const Context = context.constructor as Context & { __name: string }

        if (Context.context == null) {
            throw Error('class missing context property')
        }

        this.__contexts ??= {}

        delete this.__contexts[Context.__name]

        this.__children &&
            this.__children.forEach(child => {
                child['__removeContexts']({ [Context.__name]: context })
            })

        return this
    }

    hasContext<T extends Context<T>>(Context: T): boolean {
        const Context_ = Context as T & { __name: string }

        if (this.__contexts == null || this.__contexts[Context_.__name] == null) {
            return false
        }

        return true
    }

    context<T extends Context<T>>(Context: T): InstanceType<T> {
        const Context_ = Context as T & { __name: string }

        if (this.__contexts == null || this.__contexts[Context_.__name!] == null) {
            throw new Error('context missing')
        }

        return this.__contexts[Context_.__name!] as InstanceType<T>
    }

    emit<T extends { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        const localEvent = Object.assign({}, event)

        let eventEmitter = this.main as unknown as {
            [x: Object.Index]: Function
        }

        const emitEvent = (): void => {
            if (eventEmitter && eventEmitter[eventName]) {
                eventEmitter[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            if (!this.__children) {
                return
            }

            this.__children.forEach(child => child.emit(eventName, localEvent, globalFields))

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })
        }

        if (this.main) {
            emitWithHooks(eventName, localEvent, this.main, emitEvent)
        } else {
            emitEvent()
        }

        return this
    }

    emitReversed<T extends { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        const localEvent = Object.assign({}, event)

        let eventEmitter = this.main as unknown as {
            [x: Object.Index]: Function
        }

        const emitEvent = (): void => {
            if (eventEmitter && eventEmitter[eventName]) {
                eventEmitter[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            if (!this.__children) {
                return
            }

            for (let i = this.__children.length - 1; i >= 0; --i) {
                this.__children[i].emitReversed(eventName, localEvent, globalFields)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })
        }

        if (this.main) {
            emitWithHooks(eventName, localEvent, this.main, emitEvent)
        } else {
            emitEvent()
        }

        return this
    }

    private async __destroy(): Promise<void> {
        this.__children &&
            (await Promise.all(
                this.__children.map(child =>
                    (async (): Promise<void> => {
                        child['__parents'].remove(this)

                        if (child['__parents'].length > 0) {
                            if (this.__contexts) {
                                child['__removeContexts'](this.__contexts)
                            }
                        } else {
                            await child.destroy()
                        }
                    })()
                )
            ))

        this.__effects &&
            (await Promise.all(
                this.__effects.map(async effect => {
                    if (effect['__stateOfDestroy'] !== undefined) {
                        return
                    }

                    await effect.destroy()
                })
            ))

        this.__stateOfDestroy = 'destroyed'
    }
}
