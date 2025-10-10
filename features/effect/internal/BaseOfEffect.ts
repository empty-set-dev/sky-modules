import ContextConstructor from '../ContextConstructor'
import Effect from '../Effect'
import EffectThree from '../EffectThree'

import internal from '.'

async function dispose(this: BaseOfEffect): Promise<void> {
    internal.changeDisposeStatus(this)
    return await this['__dispose']()
}

export default abstract class BaseOfEffect {
    readonly id: number
    readonly host?: object

    get disposed(): boolean {
        return this._disposeStatus != null
    }

    [key: `on${string}Context`]: (context: unknown) => (() => Promise<void>) | void

    abstract get root(): EffectThree

    protected _disposeStatus?: undefined | 'disposing' | 'disposed'
    protected _children?: undefined | Effect[] = []
    protected _contexts?: undefined | Record<string, InstanceType<ContextConstructor>>
    protected _effects?: undefined | Effect[]
    protected _contextEffectsMap?: Record<string, Effect[]>

    constructor(host?: object) {
        this.id = ++internal.uniqueId
        if (host != null) this.host = host

        const MaybeContext = host?.constructor as ContextConstructor

        if (MaybeContext != null && MaybeContext.context) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    addContext(context: any): this {
        this.root['__pendingAddContextOperations'].push({
            context,
            target: this,
        })

        return this
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    removeContext(context: any): this {
        this.root['__pendingRemoveContextOperations'].push({
            context,
            target: this,
        })

        return this
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addContexts(contexts: any[]): this {
        for (const context of contexts) {
            this.addContext(context)
        }

        return this
    }

    hasContext<T extends ContextConstructor>(Context: T): boolean {
        return this._contexts?.[Context.name] != null
    }

    context<T extends ContextConstructor>(Context: T): InstanceType<T> {
        if (this._contexts == null || this._contexts[Context.name] == null) {
            throw new Error('context missing')
        }

        return this._contexts[Context.name!] as InstanceType<T>
    }

    emit<T extends Omit<Sky.Event, 'isCaptured'> & { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        as<Record<string, unknown>>(event)
        if (event.isCaptured === undefined) event.isCaptured = false
        const localEvent = Object.assign({}, event)
        withHooks(
            eventName,
            this.host ?? this,
            [this, this.__emit],
            eventName,
            event,
            localEvent,
            globalFields
        )
        return this
    }

    emitReversed<T extends Omit<Sky.Event, 'isCaptured'> & { isCaptured?: boolean }>(
        eventName: string,
        event: T,
        globalFields?: string[]
    ): this {
        as<Record<string, unknown>>(event)
        if (event.isCaptured === undefined) event.isCaptured = false
        const localEvent = Object.assign({}, event)
        withHooks(
            eventName,
            this.host ?? this,
            [this, this.__emitReversed],
            eventName,
            event,
            localEvent,
            globalFields
        )
        return this
    }

    private __emit(
        eventName: string,
        event: object,
        localEvent: object,
        globalFields?: string[]
    ): void {
        as<Record<string, unknown>>(event)
        as<Record<string, unknown>>(localEvent)
        const target = this.host ?? this
        as<Record<string, Function>>(target)

        if (target[eventName]) {
            target[eventName](event)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })

        if (this._children == null) {
            return
        }

        for (const child of this._children) {
            child.emit(eventName, localEvent, globalFields)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })
    }

    private __emitReversed(
        eventName: string,
        event: object,
        localEvent: object,
        globalFields?: string[]
    ): void {
        as<Record<string, unknown>>(event)
        as<Record<string, unknown>>(localEvent)
        const target = this.host ?? this
        as<Record<string, Function>>(target)

        if (target[eventName]) {
            target[eventName](event)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })

        if (this._children == null) {
            return
        }

        for (let i = this._children.length - 1; i >= 0; --i) {
            const child = this._children[i]
            child.emitReversed(eventName, localEvent, globalFields)
        }

        if (localEvent.isCaptured) {
            event.isCaptured = true
        }

        globalFields?.forEach(globalField => {
            event[globalField] = localEvent[globalField]
        })
    }

    private async __dispose(): Promise<void> {
        if (this._children) {
            await Promise.all(
                this._children.map(async child => {
                    child['__parents'].remove(this)

                    if (child['__parents'].length > 0) {
                        if (this._contexts) {
                            child['__removeContexts'](this._contexts)
                        }
                    } else {
                        await child.dispose()
                    }
                })
            )
        }

        if (this._effects) {
            await Promise.all(
                this._effects.map(async effect => {
                    if (effect['_disposeStatus'] !== undefined) {
                        return
                    }

                    await effect.dispose()
                })
            )
        }

        this._disposeStatus = 'disposed'
    }
}
