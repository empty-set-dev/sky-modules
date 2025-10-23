import { assertIsNotUndefined } from '@sky-modules/core'
import { fire } from '@sky-modules/core/async'

import ContextConstructor from './ContextConstructor'
import EffectDep from './EffectDep'
import EffectTree from './EffectTree'
import internal from './internal'

/**
 * Main effect class that extends EffectBase with dependency management.
 *
 * Effects manage hierarchical relationships, dependency tracking, and automatic cleanup.
 * They can be created with optional callback functions that return cleanup functions.
 *
 * @example
 * ```typescript
 * // Simple effect
 * const effect = new Effect(parentEffect)
 *
 * // Effect with callback and cleanup
 * const effect = new Effect(() => {
 *   console.log('Effect started')
 *   return () => console.log('Effect cleaned up')
 * }, parentEffect)
 * ```
 */
export default class Effect extends internal.EffectBase {
    readonly root: EffectTree

    private __isParentContextsResolved? = false
    private __parents: internal.EffectBase[] = []
    private __dependencies?: internal.EffectBase[]

    /**
     * Identifies this instance as an Effect.
     * @returns Always true for Effect instances
     */
    get isEffect(): boolean {
        return true
    }

    /**
     * Creates a new Effect instance.
     * @param dep The dependency (parent effect or context dependency)
     * @param host Optional host object that will receive event callbacks
     */
    constructor(dep: EffectDep, host?: object)
    /**
     * Creates a new Effect instance with a callback function.
     * @param callback Function that returns an optional cleanup function
     * @param deps The dependency (parent effect or context dependency)
     * @param host Optional host object that will receive event callbacks
     */
    constructor(callback: () => () => Promise<void> | void, dep: EffectDep, host?: object)
    constructor(arg1: unknown, arg2: unknown, arg3?: unknown) {
        let callback: undefined | (() => () => void | Promise<void>)
        let dep: EffectDep
        let host: undefined | {}

        if (typeof arg1 === 'function') {
            callback = arg1 as () => () => void | Promise<void>
            dep = arg2 as EffectDep
            host = arg3 as undefined | object
        } else {
            dep = arg1 as never
            host = arg2 as undefined | object
        }

        super(host)
        let parent: internal.EffectBase

        if (Array.isArray(dep)) {
            parent = dep[0]
        } else {
            parent = dep
        }

        if (!parent) {
            throw new Error('Effect: missing parent')
        }

        this.root = parent.root
        this.addParent(parent)

        if (Array.isArray(dep)) {
            this.addDep(dep)
        }

        if (callback) {
            const dispose = callback.call(this)

            if (dispose) {
                this.dispose = dispose
            }
        }
    }

    /**
     * Adds a parent effect to this effect.
     * The parent relationship will be established during the next commit.
     * @param parent The parent effect to add
     * @returns This effect instance for method chaining
     */
    addParent(parent: internal.EffectBase): this {
        this.root['__pendingAddParentOperations'].push({
            parent,
            child: this,
        })
        return this
    }

    /**
     * Removes a parent effect from this effect.
     * The parent relationship will be removed during the next commit.
     * @param parent The parent effect to remove
     * @returns This effect instance for method chaining
     */
    removeParent(parent: internal.EffectBase): this {
        this.root['__pendingRemoveParentOperations'].push({
            parent,
            child: this,
        })
        return this
    }

    /**
     * Removes multiple parent effects from this effect.
     * @param parents The parent effects to remove
     * @returns This effect instance for method chaining
     */
    removeParents(...parents: internal.EffectBase[]): this {
        for (const parent of parents) {
            this.addParent(parent)
        }

        return this
    }

    /**
     * Checks if this effect is a child of the specified parent.
     * @param parent The potential parent effect to check
     * @returns True if this effect is a child of the parent
     */
    isChildOf(parent: internal.EffectBase): boolean {
        return this.__parents.indexOf(parent) !== -1
    }

    /**
     * Adds a dependency to this effect.
     * The dependency will be established during the next commit.
     * @param dep The dependency to add (effect or context dependency)
     * @returns This effect instance for method chaining
     */
    addDep(dep: EffectDep): this {
        this.root['__pendingAddDependencyOperations'].push({
            dependency: dep,
            effect: this,
        })

        return this
    }

    /**
     * Adds multiple dependencies to this effect.
     * @param deps The dependencies to add
     * @returns This effect instance for method chaining
     */
    addDeps(...deps: EffectDep[]): this {
        for (const dep of deps) {
            this.addDep(dep)
        }

        return this
    }

    /**
     * Removes a dependency from this effect.
     * The dependency will be removed during the next commit.
     * @param dep The dependency to remove
     * @returns This effect instance for method chaining
     */
    removeDep(dep: EffectDep): this {
        this.root['__pendingRemoveDependencyOperations'].push({
            dependency: dep,
            effect: this,
        })

        return this
    }

    /**
     * Removes multiple dependencies from this effect.
     * @param deps The dependencies to remove
     * @returns This effect instance for method chaining
     */
    removeDeps(...deps: EffectDep[]): this {
        for (const dep of deps) {
            this.removeDep(dep)
        }

        return this
    }

    private __initContexts(): void {
        if (this.__isParentContextsResolved === false) {
            delete this.__isParentContextsResolved
            this.__parents.forEach(parent => {
                if (parent instanceof Effect) {
                    parent.__initContexts()
                }

                this.__addContexts({
                    ...parent['_contexts'],
                })
            })
        }
    }

    private __addContexts(contexts: Record<string, { constructor: unknown }>): void {
        this._contexts ??= {}

        for (const [k, context] of Object.entries(contexts)) {
            this._contexts[k] = context
            const contextTarget = this.host ?? this
            assume<{ [key: `on${string}Context`]: (context: unknown) => (() => Promise<void>) | void }>(
                contextTarget
            )

            if (contextTarget[`on${k}Context`]) {
                const dispose = contextTarget[`on${k}Context`](context)

                if (dispose) {
                    const Context = context.constructor as ContextConstructor
                    new Effect(() => dispose, [this, Context])
                }
            }
        }

        if (this._children) {
            for (const child of this._children) {
                child['__addContexts'](contexts)
            }
        }
    }

    private __removeContexts(contexts: Record<string, unknown>): void {
        for (const k of Object.keys(contexts)) {
            if (!this._contexts?.[k]) {
                continue
            }

            delete this._contexts[k]
        }

        fire(
            Promise.all,
            Object.keys(contexts).map(async k => {
                if (!this._contextEffectsMap?.[k]) {
                    return
                }

                const contextEffects = this._contextEffectsMap[k]
                await Promise.all(
                    contextEffects.map(
                        contextEffect => contextEffect.dispose() ?? internal.RESOLVED
                    )
                )
            })
        )

        if (this._children) {
            fire(
                Promise.all,
                this._children.map(child => child['__removeContexts'](contexts))
            )
        }
    }
}

Effect.prototype['__dispose'] = async function (this: Effect): Promise<void> {
    if (this['__parents']) {
        this['__parents'].forEach(parent => {
            if (parent['_disposeStatus'] === undefined) {
                assertIsNotUndefined(parent['_children'], 'Effect ~ __dispose: parent children')
                parent['_children'].remove(this)
            }
        })
    }

    if (this['__dependencies']) {
        this['__dependencies'].forEach(dep => {
            if (dep['_disposeStatus'] === undefined) {
                dep['_effects']!.remove(this)
            }
        })
    }

    await internal.EffectBase.prototype['__dispose'].call(this)
}
