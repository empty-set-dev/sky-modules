import __signalOnDestroy from './__signalOnDestroy'
import { __Context } from './_Context'

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
    private __contexts: undefined | Record<string, InstanceType<__Context>>
    private __effects: undefined | Effect[]

    constructor(main?: { root: EffectsRoot } | { effect: Effect }) {
        this.id = __uniqueId++

        if (main != null) {
            this.main = main
        }

        const Context = main?.constructor as __Context

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
        return this.__stateOfDestroy != null
    }

    get destroy(): () => void {
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
        const Context = context.constructor as __Context

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

    removeContext<T extends Context>(context: T): this {
        const Context = context.constructor as __Context

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

    hasContext<T extends Context>(Context: T): boolean {
        if (!is<__Context>(Context)) {
            return null!
        }

        if (this.__contexts == null || this.__contexts[Context.__name] == null) {
            return false
        }

        return true
    }

    context<T extends Context>(Context: T): InstanceType<T> {
        if (!is<__Context>(Context)) {
            return null!
        }

        if (this.__contexts == null || this.__contexts[Context.__name] == null) {
            throw new Error('context missing')
        }

        return this.__contexts[Context.__name!] as InstanceType<T>
    }

    emit<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
        if (!is<Record<string, unknown>>(event)) {
            return null!
        }

        const localEvent = Object.assign({}, event)

        if (this.main != null) {
            emitWithHooks(eventName, this.main, this.__emit, event, localEvent, globalFields)
        } else {
            this.__emit(eventName, event, localEvent, globalFields)
        }

        return this
    }

    emitReversed<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
        if (!is<Record<string, unknown>>(event)) {
            return null!
        }

        const localEvent = Object.assign({}, event)
        const eventEmitter = this.main as typeof this.main & Record<Object.Index, EventHandler>

        const emitEvent = (): void => {
            if (eventEmitter && eventEmitter[eventName]) {
                eventEmitter[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                ;(event[globalField] as unknown) = localEvent[globalField]
            })

            if (this.__children == null) {
                return
            }

            for (let i = this.__children.length - 1; i >= 0; --i) {
                this.__children[i].emitReversed(eventName, localEvent, globalFields)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                ;(event[globalField] as unknown) = localEvent[globalField]
            })
        }

        if (this.main != null) {
            emitWithHooks(eventName, this.main, emitEvent, localEvent)
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

    __emit(
        this: __EffectBase,
        eventName: string,
        event: Sky.Event,
        localEvent: Sky.Event,
        globalFields?: string[]
    ): void {
        if (!is<Record<string, unknown>>(event)) {
            return null!
        }
        if (!is<Record<string, unknown>>(localEvent)) {
            return null!
        }

        const eventEmitter = this.main as typeof this.main & Record<Object.Index, EventHandler>

        if (eventEmitter && eventEmitter[eventName]) {
            eventEmitter[eventName](event)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })

        if (this.__children == null) {
            return
        }

        this.__children.forEach(child => child.emit(eventName, localEvent, globalFields))

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })
    }
}

export default interface __EffectBase {}
