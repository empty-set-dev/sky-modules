import globalify from 'sky/utilities/globalify'

import __EffectBase from './__EffectBase'

import './_EffectsRoot'

declare global {
    type EffectDeps = EffectsRoot | [parent: null | EffectsRoot, ...deps: EffectDep[]]
    type Destructor = () => void | Promise<void>
    class Effect extends module.Effect {}
}

type EffectDep = EffectsRoot | Context

namespace module {
    export class Effect extends __EffectBase {
        readonly root: EffectsRoot

        constructor(
            callback: () => () => void | Promise<void>,
            deps?: EffectDeps,
            main?: { root: EffectsRoot } | { effect: Effect }
        ) {
            if (callback && typeof callback !== 'function') {
                main = deps as never
                deps = callback as never
                ;(callback as null) = null
            }

            if (!deps) {
                throw new Error('Effect: missing depends')
            }

            super(main!)

            let parent: __EffectBase

            if (Array.isArray(deps)) {
                parent = deps[0]!
            } else {
                parent = deps

                if (!parent) {
                    throw new Error('Effect: missing parent')
                }
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

        addDeps(...deps: (string | EffectDep)[]): this {
            this.__dependencies ??= []
            this.__dependencies.push(
                ...(deps.filter(dep => typeof dep !== 'string' && dep.constructor) as Effect[])
            )

            deps.forEach(dep => {
                if (typeof dep === 'string') {
                    return
                } else if (dep.constructor) {
                    dep = dep as EffectsRoot
                    dep['__effects'] ??= []
                    dep['__effects'].push(this)
                } else {
                    const Context = dep as Context
                    const contextOwner = this.__parents[0] as never as Effect
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

        await EffectsRoot.prototype['__destroy'].call(this)
    }
}

globalify(module)
