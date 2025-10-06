import globalify from '@sky-modules/core/globalify'

import internal from './internal'

declare global {
    type EffectDeps = internal.BaseOfEffect | [parent: internal.BaseOfEffect, ...deps: EffectDep[]]
    type Destructor = () => void | Promise<void>
    class Effect extends lib.Effect {}
}

type EffectDep = internal.BaseOfEffect | Context

namespace lib {
    export class Effect extends internal.BaseOfEffect {
        static get updating(): Promise<void> {
            return switch_thread()
        }

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

            let parent: internal.BaseOfEffect

            if (Array.isArray(deps)) {
                parent = deps[0]
            } else {
                parent = deps
            }

            if (!parent) {
                throw new Error('Effect: missing parent')
            }

            this.internal.parents = []

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

        addParent(parent: internal.BaseOfEffect): this {
            parent['internal.children'] ??= []
            parent['internal.children'].push(this)

            if (parent['internal.contexts']) {
                task(async () => {
                    await switch_thread()

                    if (this.isDestroyed) {
                        return
                    }

                    this.internal.initContexts()
                })
            }

            this.internal.parents.push(parent)

            return this
        }

        removeParents(...parents: EffectsRoot[]): this {
            parents.forEach(parent => {
                parent['internal.children']!.remove(this)

                if (parent['internal.contexts']) {
                    this['internal.removeContexts'](parent['internal.contexts'])
                }

                this.internal.parents.remove(parent)
            })

            if (this.internal.parents.length === 0) {
                this.destroy()
            }

            return this
        }

        isParent(parent: EffectsRoot): boolean {
            return !!parent['internal.children']?.find(child => child === this)
        }

        addDeps(...deps: EffectDep[]): this {
            this.internal.dependencies ??= []
            this.internal.dependencies.push(
                ...(deps.filter(dep => dep.context !== true) as internal.BaseOfEffect[])
            )

            deps.forEach(dep => {
                if (dep.context !== true) {
                    dep = dep as EffectsRoot
                    dep['internal.effects'] ??= []
                    dep['internal.effects'].push(this)
                } else {
                    const Context = dep as internal.Context
                    const contextOwner = this.internal.parents[0] as Effect
                    const context = contextOwner.context(Context)

                    if (!context) {
                        throw new Error('context missing')
                    }

                    contextOwner['internal.contextEffects'] ??= {}
                    contextOwner['internal.contextEffects'][Context.internal.name!] ??= []
                    contextOwner['internal.contextEffects'][Context.internal.name!].push(this)
                }
            })

            return this
        }

        hasContext<T extends Context>(Context: T): boolean {
            this.internal.initContexts()

            return super.hasContext(Context)
        }

        context<T extends Context>(Context: T): InstanceType<T> {
            this.internal.initContexts()

            return super.context(Context)
        }

        private internal.initContexts(): void {
            if (this.internal.isGotParentContexts === false) {
                delete this.internal.isGotParentContexts

                this.internal.parents.forEach(parent => {
                    if (parent instanceof Effect) {
                        parent.internal.initContexts()
                    }

                    this.internal.addContexts({
                        ...(parent['internal.contexts'] as Record<string, { constructor: unknown }>),
                    })
                })
            }
        }

        private internal.addContexts(contexts: Record<string, { constructor: unknown }>): void {
            this['internal.contexts'] ??= {}

            Object.keys(contexts).forEach(k => {
                const context = contexts[k]
                this['internal.contexts']![k] = context

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

            this['internal.children']?.forEach(child => child['internal.addContexts'](contexts))
        }

        private async internal.removeContexts(contexts: Record<string, unknown>): Promise<void> {
            Object.keys(contexts).forEach(k => {
                if (!this['internal.contexts'] || !this['internal.contexts'][k]) {
                    return
                }

                delete this['internal.contexts']![k]
            })

            await Promise.all(
                Object.keys(contexts).map(async k => {
                    if (this['internal.contextEffects'] == null || this['internal.contextEffects'][k] == null) {
                        return
                    }

                    const contextEffects = this.internal.contextEffects[k] as Effect[]

                    await Promise.all(contextEffects.map(contextEffect => contextEffect.destroy()))
                })
            )

            if (this['internal.children'] != null) {
                await Promise.all(
                    this['internal.children'].map(child => child['internal.removeContexts'](contexts))
                )
            }
        }

        private internal.isGotParentContexts? = false
        private internal.parents!: internal.BaseOfEffect[]
        private internal.dependencies!: internal.BaseOfEffect[]
        private internal.contextEffects!: Record<string, Effect[]>
    }

    Effect.prototype['internal.destroy'] = async function (this: Effect): Promise<void> {
        if (this['internal.parents']) {
            this['internal.parents'].forEach(parent => {
                if (parent['internal.stateOfDestroy'] === undefined) {
                    parent['internal.children']!.remove(this)
                }
            })
        }

        if (this['internal.dependencies']) {
            this['internal.dependencies'].forEach(dep => {
                if (dep['internal.stateOfDestroy'] === undefined) {
                    dep['internal.effects']!.remove(this)
                }
            })
        }

        await internal.BaseOfEffect.prototype['internal.destroy'].call(this)
    }
}

globalify(lib)
