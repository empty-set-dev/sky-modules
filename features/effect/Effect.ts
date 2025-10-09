import { assertIsNotUndefined } from '@sky-modules/core'
import { fire } from '@sky-modules/core/async'

import ContextConstructor from './ContextConstructor'
import EffectDep from './EffectDep'
import EffectThree from './EffectThree'
import internal from './internal'

export default class Effect extends internal.BaseOfEffect {
    readonly root: EffectThree

    private __isParentContextsResolved? = false
    private __parents: internal.BaseOfEffect[] = []
    private __dependencies?: internal.BaseOfEffect[]

    get isEffect(): boolean {
        return true
    }

    constructor(dep: EffectDep, host?: object)
    constructor(callback: () => () => Promise<void> | void, deps: EffectDep, host?: object)
    constructor(arg1: unknown, arg2: unknown, arg3?: unknown) {
        let callback: undefined | (() => () => void | Promise<void>)
        let deps: EffectDep
        let host: undefined | {}

        if (typeof arg1 === 'function') {
            callback = arg1 as () => () => void | Promise<void>
            deps = arg2 as EffectDep
            host = arg3 as undefined | object
        } else {
            deps = arg1 as never
            host = arg2 as undefined | object
        }

        super(host)
        let parent: internal.BaseOfEffect

        if (Array.isArray(deps)) {
            parent = deps[0]
        } else {
            parent = deps
        }

        if (!parent) {
            throw new Error('Effect: missing parent')
        }

        this.addParent(parent)
        this.root = parent.root

        if (Array.isArray(deps)) {
            this.addDep(deps)
        }

        if (callback) {
            const dispose = callback.call(this)

            if (dispose) {
                this.dispose = dispose
            }
        }
    }

    addParent(parent: internal.BaseOfEffect): this {
        this.root['__pendingAddParentOperations'].push({
            parent,
            child: this,
        })
        return this
    }

    removeParent(parent: internal.BaseOfEffect): this {
        this.root['__pendingRemoveParentOperations'].push({
            parent,
            child: this,
        })
        return this
    }

    removeParents(...parents: internal.BaseOfEffect[]): this {
        for (const parent of parents) {
            this.addParent(parent)
        }

        return this
    }

    isChildOf(parent: internal.BaseOfEffect): boolean {
        return this.__parents.indexOf(parent) !== -1
    }

    addDep(dep: EffectDep): this {
        this.root['__pendingAddDependencyOperations'].push({
            dependency: dep,
            effect: this,
        })

        return this
    }

    addDeps(...deps: EffectDep[]): this {
        for (const dep of deps) {
            this.addDep(dep)
        }

        return this
    }

    removeDep(dep: EffectDep): this {
        this.root['__pendingRemoveDependencyOperations'].push({
            dependency: dep,
            effect: this,
        })

        return this
    }

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
            as<{ [key: `on${string}Context`]: (context: unknown) => (() => Promise<void>) | void }>(
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

    await internal.BaseOfEffect.prototype['__dispose'].call(this)
}
