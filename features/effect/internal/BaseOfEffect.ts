import ContextConstructor from '../ContextConstructor'
import { Effect } from '../Effect'

import internal from '.'

async function dispose(this: BaseOfEffect): Promise<void> {
    internal.signalOnDestroy(this)
    return await this['__dispose']()
}

export default abstract class BaseOfEffect {
    readonly id: number
    readonly host?: object

    get disposed(): boolean {
        return this._disposeStatus != null
    }

    protected _disposeStatus: undefined | 'disposing' | 'disposed'
    protected _children: undefined | Effect[] = []
    protected _contexts: undefined | Record<string, InstanceType<ContextConstructor>>
    protected _effects: undefined | Effect[]

    constructor(host?: object) {
        this.id = ++internal.uniqueId

        if (host != null) {
            this.host = host
        }

        const MaybeContext = host?.constructor as ContextConstructor

        if (MaybeContext && MaybeContext.context) {
            const Context = MaybeContext
            this._contexts = {
                [Context.name]: host,
            }
        }
    }

    get dispose(): () => void | PromiseLike<void> {
        return dispose
    }

    set dispose(dispose: () => void | PromiseLike<void>) {
        const originalDispose = this.__dispose

        this.__dispose = async (): Promise<void> => {
            if (this._disposeStatus === 'disposed') {
                return
            }

            await dispose.call(this)
            await originalDispose.call(this)
        }
    }

    isParentOf(child: Effect): boolean {
        return this._children?.indexOf(child) !== -1
    }

    // get updating(): null | Promise<void> {
    //     // eslint-disable-next-line no-constant-condition
    //     if (true) {
    //         return null
    //     }

    //     // TODO
    //     return switch_thread()
    // }

    addContext<T extends ContextConstructor>(context: InstanceType<T>): this {
        const Context: ContextConstructor = context.constructor

        if (Context.context == null) {
            throw new Error('class missing context property')
        }

        this._contexts ??= {}
        this._contexts[Context.name] = context

        // this._children &&
        //     this._children.forEach(child => {
        //         child['__addContexts']({
        //             [Context.name]: context,
        //         })
        //     })

        return this
    }

    // removeContext<T extends Context>(context: T): this {
    //     const Context = context.constructor as __Context

    //     if (Context.context == null) {
    //         throw new Error('class missing context property')
    //     }

    //     this._contexts ??= {}

    //     delete this._contexts[Context.__name]

    //     this._children &&
    //         this._children.forEach(child => {
    //             child['__removeContexts']({ [Context.__name]: context })
    //         })

    //     return this
    // }

    hasContext<T extends ContextConstructor>(Context: T): boolean {
        if (this._contexts == null || this._contexts[Context.name] == null) {
            return false
        }

        return true
    }

    context<T extends ContextConstructor>(Context: T): InstanceType<T> {
        if (this._contexts == null || this._contexts[Context.name] == null) {
            throw new Error('context missing')
        }

        return this._contexts[Context.name!] as InstanceType<T>
    }

    // emit<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
    //     as<Record<string, unknown>>(event)

    //     const localEvent = Object.assign({}, event)

    //     if (this.main != null) {
    //         emitWithHooks(eventName, this.main, this, this.__emit, event, localEvent, globalFields)
    //     } else {
    //         this.__emit(eventName, event, localEvent, globalFields)
    //     }

    //     return this
    // }

    // emitReversed<T extends Sky.Event>(eventName: string, event: T, globalFields?: string[]): this {
    //     as<Record<string, unknown>>(event)

    //     const localEvent = Object.assign({}, event)

    //     if (this.main != null) {
    //         emitWithHooks(
    //             eventName,
    //             this.main,
    //             this,
    //             this.__emitReversed,
    //             event,
    //             localEvent,
    //             globalFields
    //         )
    //     } else {
    //         this.__emitReversed(eventName, event, localEvent, globalFields)
    //     }

    //     return this
    // }

    private async __dispose(): Promise<void> {
        if (this._children) {
            for (const child of this._children) {
                child['__parents'].remove(this)

                // if (child['__parents'].length > 0) {
                //     if (this._contexts) {
                //         child['__removeContexts'](this._contexts)
                //     }
                // } else {
                //     await child.dispose()
                // }
            }
        }

        this._effects &&
            (await Promise.all(
                this._effects.map(async effect => {
                    if (effect['_disposeStatus'] !== undefined) {
                        return
                    }

                    await effect.dispose()
                })
            ))

        this._disposeStatus = 'disposed'
    }

    // __emit(
    //     this: BaseOfEffect,
    //     eventName: string,
    //     event: Sky.Event,
    //     localEvent: Sky.Event,
    //     globalFields?: string[]
    // ): void {
    //     as<Record<string, unknown>>(event)
    //     as<Record<string, unknown>>(localEvent)

    //     const eventEmitter = this.main as typeof this.main & Record<PropertyKey, EventHandler>

    //     if (eventEmitter && eventEmitter[eventName]) {
    //         eventEmitter[eventName](event)
    //     }

    //     if (localEvent.isCaptured) {
    //         event.isCaptured = true
    //     }

    //     globalFields?.forEach(globalField => {
    //         event[globalField] = localEvent[globalField]
    //     })

    //     if (this._children == null) {
    //         return
    //     }

    //     this._children.forEach(child => child.emit(eventName, localEvent, globalFields))

    //     if (localEvent.isCaptured) {
    //         event.isCaptured = true
    //     }

    //     globalFields?.forEach(globalField => {
    //         event[globalField] = localEvent[globalField]
    //     })
    // }

    // __emitReversed(
    //     this: __BaseOfEffect,
    //     eventName: string,
    //     event: Sky.Event,
    //     localEvent: Sky.Event,
    //     globalFields?: string[]
    // ): void {
    //     as<Record<string, unknown>>(event)
    //     as<Record<string, unknown>>(localEvent)

    //     const eventEmitter = this.main as typeof this.main & Record<PropertyKey, EventHandler>

    //     if (eventEmitter && eventEmitter[eventName]) {
    //         eventEmitter[eventName](event)
    //     }

    //     if (localEvent.isCaptured) {
    //         event.isCaptured = true
    //     }

    //     globalFields?.forEach(globalField => {
    //         event[globalField] = localEvent[globalField]
    //     })

    //     if (this._children == null) {
    //         return
    //     }

    //     for (let i = this._children.length - 1; i >= 0; --i) {
    //         this._children[i].emitReversed(eventName, localEvent, globalFields)
    //     }

    //     if (localEvent.isCaptured) {
    //         event.isCaptured = true
    //     }

    //     globalFields?.forEach(globalField => {
    //         event[globalField] = localEvent[globalField]
    //     })
    // }
}
