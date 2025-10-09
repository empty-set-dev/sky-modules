import { assertIsNotUndefined } from '@sky-modules/core'

import ContextConstructor from './ContextConstructor'
import EffectDeps from './EffectDeps'
import { EffectThree } from './EffectThree'
import internal from './internal'

export class Effect extends internal.BaseOfEffect {
    readonly root: EffectThree

    private __isParentContextsResolved? = false
    private __parents: internal.BaseOfEffect[] = []
    private __dependencies?: internal.BaseOfEffect[]

    constructor(deps: EffectDeps, host?: object)
    constructor(callback: () => () => void | Promise<void>, deps: EffectDeps, main?: object)
    constructor(arg1: unknown, arg2: unknown, arg3?: unknown) {
        let callback: undefined | (() => () => void | Promise<void>)
        let deps: EffectDeps
        let host: undefined | {}

        if (typeof arg1 === 'function') {
            callback = arg1 as () => () => void | Promise<void>
            deps = arg2 as EffectDeps
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
        this.root = (parent as Effect).root ?? parent

        if (Array.isArray(deps)) {
            this.addDeps(deps)
        }

        if (callback) {
            const dispose = callback.call(this)

            if (dispose) {
                this.dispose = dispose
            }
        }
    }

    addParent(parent: internal.BaseOfEffect): this {
        parent['_children'] ??= []
        parent['_children'].push(this)

        if (parent['_contexts']) {
            fire(async () => {
                await switch_thread()

                if (this.disposed) {
                    return
                }

                this.__initContexts()
            })
        }

        this.__parents.push(parent)
        return this
    }

    removeParents(...parents: EffectThree[]): this {
        parents.forEach(parent => {
            assertIsNotUndefined(parent['_children'], 'Effect ~ removeParents: parent children')
            parent['_children'].remove(this)

            // if (parent['__contexts']) {
            //     this['__removeContexts'](parent['__contexts'])
            // }

            this.__parents.remove(parent)
        })

        if (this.__parents.length === 0) {
            this.dispose()
        }

        return this
    }

    isChildOf(parent: internal.BaseOfEffect): boolean {
        return this.__parents.indexOf(parent) !== -1
    }

    addDeps(...deps: EffectDeps[]): this {
        this.__dependencies ??= []

        for (const dep of deps) {
            if (Array.isArray(dep)) {
                const Context = dep[1]
                const contextOwner = dep[0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('Effect ~ addDeps: context missing')
                }

                contextOwner['_contextEffectsMap'] ??= {}
                contextOwner['_contextEffectsMap'][Context.name] ??= []
                contextOwner['_contextEffectsMap'][Context.name].push(this)
            } else {
                this.__dependencies ??= []
                this.__dependencies.push(dep)
                dep['_effects'] ??= []
                dep['_effects'].push(this)
            }
        }

        return this
    }

    //     hasContext<T extends Context>(Context: T): boolean {
    //         this.__initContexts()
    //         return super.hasContext(Context)
    //     }
    //     context<T extends Context>(Context: T): InstanceType<T> {
    //         this.__initContexts()
    //         return super.context(Context)
    //     }

    private __initContexts(): void {
        if (this.__isParentContextsResolved === false) {
            delete this.__isParentContextsResolved
            this.__parents.forEach(parent => {
                if (parent instanceof Effect) {
                    parent.__initContexts()
                }

                this.__addContexts({
                    ...(parent['_contexts'] as Record<string, {}>),
                })
            })
        }
    }
    //     private internal.addContexts(contexts: Record<string, { constructor: unknown }>): void {
    //         this['internal.contexts'] ??= {}
    //         Object.keys(contexts).forEach(k => {
    //             const context = contexts[k]
    //             this['internal.contexts']![k] = context
    //             const contextTarget = this.main ?? this
    //             if ((contextTarget as never as { [x: string]: Function })[`on${k}Context`]) {
    //                 const destroy = (contextTarget as never as { [x: string]: Function })[
    //                     `on${k}Context`
    //                 ](context)
    //                 if (destroy) {
    //                     const Context = context.constructor as Context
    //                     new Effect(() => destroy, [this, Context])
    //                 }
    //             }
    //         })
    //         this['internal.children']?.forEach(child => child['internal.addContexts'](contexts))
    //     }
    //     private async internal.removeContexts(contexts: Record<string, unknown>): Promise<void> {
    //         Object.keys(contexts).forEach(k => {
    //             if (!this['internal.contexts'] || !this['internal.contexts'][k]) {
    //                 return
    //             }
    //             delete this['internal.contexts']![k]
    //         })
    //         await Promise.all(
    //             Object.keys(contexts).map(async k => {
    //                 if (this['internal.contextEffects'] == null || this['internal.contextEffects'][k] == null) {
    //                     return
    //                 }
    //                 const contextEffects = this.internal.contextEffects[k] as Effect[]
    //                 await Promise.all(contextEffects.map(contextEffect => contextEffect.destroy()))
    //             })
    //         )
    //         if (this['internal.children'] != null) {
    //             await Promise.all(
    //                 this['internal.children'].map(child => child['internal.removeContexts'](contexts))
    //             )
    //         }
    //     }
    // }
    // Effect.prototype['internal.destroy'] = async function (this: Effect): Promise<void> {
    //     if (this['internal.parents']) {
    //         this['internal.parents'].forEach(parent => {
    //             if (parent['internal.stateOfDestroy'] === undefined) {
    //                 parent['internal.children']!.remove(this)
    //             }
    //         })
    //     }
    //     if (this['internal.dependencies']) {
    //         this['internal.dependencies'].forEach(dep => {
    //             if (dep['internal.stateOfDestroy'] === undefined) {
    //                 dep['internal.effects']!.remove(this)
    //             }
    //         })
    //     }
    //     await internal.BaseOfEffect.prototype['internal.destroy'].call(this)
}
