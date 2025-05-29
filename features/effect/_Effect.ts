import globalify from 'sky/utilities/globalify'

import __EffectBase from './__EffectBase'

declare global {
    type EffectDeps = __EffectBase | [parent: __EffectBase, ...deps: EffectDep[]]
    type Destructor = () => void | Promise<void>
    class Effect extends module.Effect {}
}

type EffectDep = __EffectBase | Context

namespace module {
    export class Effect extends __EffectBase {
        readonly root: EffectsRoot

        constructor(deps: EffectDeps, main?: { effect: Effect })
        constructor(
            callback: () => () => void | Promise<void>,
            deps: EffectDeps,
            main?: { effect: Effect }
        )
        constructor(arg1: unknown, arg2: unknown, arg3?: unknown) {
            let callback: undefined | (() => () => void | Promise<void>)
            let deps: EffectDeps
            let main: undefined | { effect: Effect }

            if (typeof arg1 === 'function') {
                callback = arg1 as () => () => void | Promise<void>
                deps = arg2 as EffectDeps
                main = arg3 as undefined | { effect: Effect }
            } else {
                deps = arg1 as never
                main = arg2 as undefined | { effect: Effect }
            }

            if (!deps) {
                throw new Error('Effect: missing depends')
            }

            super(main)

            let parent: __EffectBase

            if (Array.isArray(deps)) {
                parent = deps[0]!
            } else {
                parent = deps
            }

            if (!parent) {
                throw new Error('Effect: missing parent')
            }

            this.__parents = []

            this.addParent(parent)
            this.root = (parent as Effect).root ?? parent

            if (Array.isArray(deps) && deps.length > 1) {
                this.addDeps(...(deps.slice(1) as EffectDep[]))
            }

            if (callback) {
                const destroy = callback.call(this)

                if (destroy) {
                    this.destroy = destroy
                }
            }
        }

        addParent(parent: __EffectBase): this {
            parent['__children'] ??= []
            parent['__children'].push(this)

            if (parent['__contexts']) {
                async(() => {
                    this.__addContexts({
                        ...(parent['__contexts'] as Record<string, { constructor: unknown }>),
                    })
                })
            }

            this.__parents.push(parent)

            return this
        }

        removeParents(...parents: EffectsRoot[]): this {
            parents.forEach(parent => {
                parent['__children']!.remove(this)

                if (parent['__contexts']) {
                    this['__removeContexts'](parent['__contexts'])
                }

                this.__parents.remove(parent)
            })

            if (this.__parents.length === 0) {
                this.destroy()
            }

            return this
        }

        isParent(parent: EffectsRoot): boolean {
            return !!parent['__children']?.find(child => child === this)
        }

        addDeps(...deps: EffectDep[]): this {
            this.__dependencies ??= []
            this.__dependencies.push(
                ...(deps.filter(dep => dep.context !== true) as __EffectBase[])
            )

            deps.forEach(dep => {
                if (dep.context !== true) {
                    dep = dep as EffectsRoot
                    dep['__effects'] ??= []
                    dep['__effects'].push(this)
                } else {
                    const Context = dep as Context
                    const contextOwner = this.__parents[0] as Effect
                    const context = contextOwner.context(Context)

                    if (!context) {
                        throw new Error('context missing')
                    }

                    contextOwner['__contextEffects'] ??= {}
                    contextOwner['__contextEffects'][Context.name] ??= []
                    contextOwner['__contextEffects'][Context.name].push(this)
                }
            })

            return this
        }

        private __addContexts(contexts: Record<string, { constructor: unknown }>): void {
            this['__contexts'] ??= {}

            Object.keys(contexts).forEach(k => {
                const context = contexts[k]
                this['__contexts']![k] = context

                const contextTarget = this.main ?? this
                if ((contextTarget as never as { [x: string]: Function })[`on${k}Context`]) {
                    const destroy = (contextTarget as never as { [x: string]: Function })[
                        `on${k}Context`
                    ](context)

                    if (destroy) {
                        const Context = context.constructor as Context
                        new Effect(() => destroy, [this, Context])
                    }
                }
            })

            this['__children']?.forEach(child => child['__addContexts'](contexts))
        }

        private async __removeContexts(contexts: Record<string, unknown>): Promise<void> {
            await Promise.all(
                Object.keys(contexts).map(async k => {
                    if (!this['__contexts'] || !this['__contexts'][k]) {
                        return
                    }

                    delete this['__contexts']![k]
                })
            )

            await Promise.all(
                Object.keys(contexts).map(async k => {
                    if (!this['__contextEffects'] || !this['__contextEffects'][k]) {
                        return
                    }

                    const contextEffects = this.__contextEffects[k] as Effect[]

                    await Promise.all(contextEffects.map(contextEffect => contextEffect.destroy()))
                })
            )

            this['__children']?.forEach(child => child['__removeContexts'](contexts))
        }

        private __parents!: __EffectBase[]
        private __dependencies!: __EffectBase[]
        private __contextEffects!: Record<string, Effect[]>
    }

    Effect.prototype['__destroy'] = async function (this: Effect): Promise<void> {
        if (this['__parents']) {
            this['__parents'].forEach(parent => {
                if (parent['__isDestroyed'] !== undefined) {
                    parent['__children']!.remove(this)
                }
            })
        }

        if (this['__dependencies']) {
            this['__dependencies'].forEach(dep => {
                if (dep['__isDestroyed'] === undefined) {
                    dep['__effects']!.remove(this)
                }
            })
        }

        await __EffectBase.prototype['__destroy'].call(this)
    }
}

globalify(module)
