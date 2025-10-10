import '@sky-modules/core/hooks'

import ContextConstructor from '../ContextConstructor'
import Effect from '../Effect'
import EffectTree from '../EffectTree'

import internal from '.'

async function dispose(this: BaseOfEffect): Promise<void> {
    internal.changeDisposeStatus(this)
    return await this['__dispose']()
}

/**
 * Abstract base class for all effects in the effect system.
 *
 * Provides core functionality for lifecycle management, context propagation,
 * event handling, and parent-child relationships. All effect types extend
 * from this base class.
 *
 * Key features:
 * - Automatic disposal and cleanup
 * - Context system for dependency injection
 * - Event emission with capturing and bubbling
 * - Hierarchical parent-child relationships
 */
export default abstract class BaseOfEffect {
    readonly id: number
    readonly host?: object

    /**
     * Whether this effect has been disposed.
     * @returns True if the effect is disposed or in the process of being disposed
     */
    get disposed(): boolean {
        return this._disposeStatus != null
    }

    [key: `on${string}Context`]: (context: unknown) => (() => Promise<void>) | void

    /**
     * Reference to the root EffectTree instance that manages this effect tree.
     * @returns The root EffectTree instance
     */
    abstract get root(): EffectTree

    protected _disposeStatus?: undefined | 'disposing' | 'disposed'
    protected _children?: undefined | Effect[] = []
    protected _contexts?: undefined | Record<string, InstanceType<ContextConstructor>>
    protected _effects?: undefined | Effect[]
    protected _contextEffectsMap?: Record<string, Effect[]>

    /**
     * Creates a new BaseOfEffect instance.
     * @param host Optional host object that will receive event callbacks
     */
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

    /**
     * Gets the dispose function for this effect.
     * @returns Function that disposes this effect and all its children
     */
    get dispose(): () => void | PromiseLike<void> {
        return dispose
    }

    /**
     * Sets a custom dispose function for this effect.
     * @param dispose Custom disposal function to call before default cleanup
     */
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

    /**
     * Checks if this effect is a parent of the given child effect.
     * @param child The effect to check
     * @returns True if this effect is a parent of the child
     */
    isParentOf(child: Effect): boolean {
        return this._children?.indexOf(child) !== -1
    }

    /**
     * Adds a context instance to this effect.
     * The context will be propagated to all child effects.
     * @param context The context instance to add
     * @returns This effect instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    addContext(context: any): this {
        this.root['__pendingAddContextOperations'].push({
            context,
            target: this,
        })

        return this
    }

    /**
     * Removes a context instance from this effect.
     * The context will be removed from all child effects as well.
     * @param context The context instance to remove
     * @returns This effect instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    removeContext(context: any): this {
        this.root['__pendingRemoveContextOperations'].push({
            context,
            target: this,
        })

        return this
    }

    /**
     * Adds multiple context instances to this effect.
     * @param contexts Array of context instances to add
     * @returns This effect instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addContexts(contexts: any[]): this {
        for (const context of contexts) {
            this.addContext(context)
        }

        return this
    }

    /**
     * Checks if this effect has a specific context type.
     * @param Context The context constructor to check for
     * @returns True if the context is available
     */
    hasContext<T extends ContextConstructor>(Context: T): boolean {
        return this._contexts?.[Context.name] != null
    }

    /**
     * Retrieves a context instance of the specified type.
     * @param Context The context constructor
     * @returns The context instance
     * @throws Error if the context is not available
     */
    context<T extends ContextConstructor>(Context: T): InstanceType<T> {
        if (this._contexts == null || this._contexts[Context.name] == null) {
            throw new Error('context missing')
        }

        return this._contexts[Context.name!] as InstanceType<T>
    }

    /**
     * Emits an event down through the effect hierarchy (parent to children).
     * Events can be captured by any effect in the hierarchy.
     * @param eventName The name of the event to emit
     * @param event The event data
     * @param globalFields Optional array of field names to propagate globally
     * @returns This effect instance for method chaining
     */
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

    /**
     * Emits an event up through the effect hierarchy (children to parent) in reverse order.
     * Useful for bubbling events from children to parents.
     * @param eventName The name of the event to emit
     * @param event The event data
     * @param globalFields Optional array of field names to propagate globally
     * @returns This effect instance for method chaining
     */
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
