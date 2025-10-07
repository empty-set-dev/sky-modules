import { EffectRoot } from '../EffectRoot'

import ContextConstructor from './ContextConstructor';

import internal from '.'

async function destroy(this: BaseOfEffect): Promise<void> {
    internal.signalOnDestroy(this)
    return await this['__dispose']()
}

export default abstract class BaseOfEffect {
    readonly id: number
    readonly main?: { root: EffectRoot } | { effect: Effect }

    private __disposeStatus: undefined | 'disposing' | 'disposed'
    private __children: undefined | Effect[] = []
    private __contexts: undefined | Record<string, InstanceType<internal.ContextConstructor>>
    private __effects: undefined | Effect[]

    constructor(main?: { root: EffectRoot } | { effect: Effect }) {
        this.id = ++internal.uniqueId

        if (main != null) {
            this.main = main
        }

        const Context = main?.constructor as internal.ContextConstructor

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
        return this.__disposeStatus != null
    }

    get destroy(): () => void | PromiseLike<void> {
        return destroy
    }

    set destroy(destroy: () => void | PromiseLike<void>) {
        const originalDestroy = this.__destroy

        this.__destroy = async (): Promise<void> => {
            if (this.__disposeStatus === 'disposed') {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    get updating(): null | Promise<void> {
        // eslint-disable-next-line no-constant-condition
        if (true) {
            return null
        }

        // TODO
        return switch_thread()
    }

    addContext(
        ContextConstructor: ContextConstructor,
        context: InstanceType<ContextConstructor>
    ): this {
        const Context = context.constructor as __Context

        if (Context.context == null) {
            throw new Error('class missing context property')
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
            throw new Error('class missing context property')
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
        as<__Context>(Context)

        if (this.__contexts == null || this.__contexts[Context.__name] == null) {
            return false
        }

        return true
    }

    context<T extends Context>(Context: T): InstanceType<T> {
        as<__Context>(Context)

        if (this.__contexts == null || this.__contexts[Context.__name] == null) {
            throw new Error('context missing')
        }

        return this.__contexts[Context.__name!] as InstanceType<T>
    }

    emit<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
        as<Record<string, unknown>>(event)

        const localEvent = Object.assign({}, event)

        if (this.main != null) {
            emitWithHooks(eventName, this.main, this, this.__emit, event, localEvent, globalFields)
        } else {
            this.__emit(eventName, event, localEvent, globalFields)
        }

        return this
    }

    emitReversed<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
        as<Record<string, unknown>>(event)

        const localEvent = Object.assign({}, event)

        if (this.main != null) {
            emitWithHooks(
                eventName,
                this.main,
                this,
                this.__emitReversed,
                event,
                localEvent,
                globalFields
            )
        } else {
            this.__emitReversed(eventName, event, localEvent, globalFields)
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
                    if (effect['__disposeStatus'] !== undefined) {
                        return
                    }

                    await effect.destroy()
                })
            ))

        this.__disposeStatus = 'disposed'
    }

    __emit(
        this: __BaseOfEffect,
        eventName: string,
        event: Sky.Event,
        localEvent: Sky.Event,
        globalFields?: string[]
    ): void {
        as<Record<string, unknown>>(event)
        as<Record<string, unknown>>(localEvent)

        const eventEmitter = this.main as typeof this.main & Record<PropertyKey, EventHandler>

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

    __emitReversed(
        this: __BaseOfEffect,
        eventName: string,
        event: Sky.Event,
        localEvent: Sky.Event,
        globalFields?: string[]
    ): void {
        as<Record<string, unknown>>(event)
        as<Record<string, unknown>>(localEvent)

        const eventEmitter = this.main as typeof this.main & Record<PropertyKey, EventHandler>

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

        for (let i = this.__children.length - 1; i >= 0; --i) {
            this.__children[i].emitReversed(eventName, localEvent, globalFields)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })
    }
}

export default BaseOfEffect
