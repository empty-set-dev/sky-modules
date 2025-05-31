import __signalOnDestroy from './__signalDestroyed'

let __uniqueId = 1

async function __destroy(this: EffectsRoot): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

export default abstract class __EffectBase {
    readonly id: number
    readonly main?: { root: EffectsRoot } | { effect: Effect }

    constructor(main?: { root: EffectsRoot } | { effect: Effect }) {
        this.id = __uniqueId
        ++__uniqueId

        this.main = main

        const Context = main?.constructor as Context

        if (Context && Context.context) {
            if (Context.name.startsWith('_')) {
                Context.__name = Context.name.slice(1)
            } else {
                Context.__name = Context.name
            }

            this.__contexts = {
                [Context.__name]: main,
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
            if (this.__isDestroyed) {
                return
            }

            await destroy.call(this)
            await originalDestroy.call(this)
        }
    }

    addContext<T extends { constructor: Function }>(context: T): this {
        const Context = context.constructor as Context

        if (!Context.context) {
            throw Error('class missing context property')
        }

        this.__contexts ??= {}

        this.__contexts[Context.__name!] = context

        this.__children &&
            this.__children.forEach(child => {
                child['__addContexts']({
                    [Context.__name!]: context,
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

        delete this.__contexts[Context.__name!]

        this.__children &&
            this.__children.forEach(child => {
                child['__removeContexts']({ [Context.__name!]: context })
            })

        return this
    }

    hasContext<T extends Context<T>>(Context: T): boolean {
        if (!this.__contexts || !this.__contexts[Context.__name!]) {
            return false
        }

        return true
    }

    context<T extends Context<T>>(Context: T): InstanceType<T> {
        if (!this.__contexts || !this.__contexts[Context.__name!]) {
            throw new Error('context missing')
        }

        return this.__contexts[Context.__name!] as InstanceType<T>
    }

    emit<T extends { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        const localEvent = Object.assign({}, event)

        let eventEmitterAndActionsHooks: {
            [x: Object.Index]: Function
        } & {
            __hooks: Record<Object.Index, Function>
        } = this.main as never

        const emitEvent = (): void => {
            if (eventEmitterAndActionsHooks && eventEmitterAndActionsHooks[eventName]) {
                eventEmitterAndActionsHooks[eventName](localEvent)
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

        const emitEventWithHooks = (): void => {
            if (
                eventEmitterAndActionsHooks &&
                eventEmitterAndActionsHooks.__hooks &&
                eventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                eventEmitterAndActionsHooks.__hooks[eventName].call(
                    eventEmitterAndActionsHooks,
                    localEvent,
                    emitEvent
                )

                return
            }

            emitEvent()
        }

        if (
            eventEmitterAndActionsHooks &&
            eventEmitterAndActionsHooks.__hooks &&
            eventEmitterAndActionsHooks.__hooks.onAny
        ) {
            eventEmitterAndActionsHooks.__hooks.onAny.call(
                eventEmitterAndActionsHooks,
                eventName,
                localEvent,
                emitEventWithHooks
            )

            return this
        }

        emitEventWithHooks()

        return this
    }

    emitReversed<T extends { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        const localEvent = Object.assign({}, event)

        let eventEmitterAndActionsHooks: {
            [x: Object.Index]: Function
        } & {
            __hooks: Record<Object.Index, Function>
        } = this.main as never

        const emitEvent = (): void => {
            if (eventEmitterAndActionsHooks && eventEmitterAndActionsHooks[eventName]) {
                eventEmitterAndActionsHooks[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            if (!this.__children) {
                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })

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

        function emitEventWithHooks(): void {
            if (
                eventEmitterAndActionsHooks &&
                eventEmitterAndActionsHooks.__hooks &&
                eventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                eventEmitterAndActionsHooks.__hooks[eventName].call(
                    eventEmitterAndActionsHooks,
                    localEvent,
                    emitEvent
                )

                return
            }

            emitEvent()
        }

        if (
            eventEmitterAndActionsHooks &&
            eventEmitterAndActionsHooks.__hooks &&
            eventEmitterAndActionsHooks.__hooks.onAny
        ) {
            eventEmitterAndActionsHooks.__hooks.onAny.call(
                eventEmitterAndActionsHooks,
                eventName,
                localEvent,
                emitEventWithHooks
            )

            return this
        }

        emitEventWithHooks()

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
    private __children: undefined | Effect[]
    private __contexts: undefined | Record<string, unknown>
    private __effects: undefined | Effect[]
}
