import globalify from 'sky/helpers/globalify'

import './_EffectsRoot'

declare global {
    type EffectDeps = EffectsRoot | [parent: null | EffectsRoot, ...deps: (string | EffectDep)[]]

    type Destructor = () => void | Promise<void>

    class Effect<A extends unknown[] = []> extends lib.Effect<A> {
        constructor(deps: EffectDeps)
        constructor(
            callback: (this: Effect<A>, ...args: A) => void | (() => void | Promise<void>),
            deps: EffectDeps,
            ...args: A
        )
        addParent(parent: EffectsRoot, group?: string): this
        removeParents(...parents: EffectsRoot[]): this
        isParent(parent: EffectsRoot): boolean
        addDeps(...deps: EffectDep[]): this
    }
}

type EffectDep = EffectsRoot | Context

namespace lib {
    export class Effect<A extends unknown[] = []> extends EffectsRoot {
        constructor(
            callback: (...args: A) => () => void | Promise<void>,
            deps?: EffectDeps,
            ...args: A
        ) {
            super()

            if (callback && typeof callback !== 'function') {
                deps = callback as never as EffectDeps
                ;(callback as null) = null
            }

            if (!deps) {
                throw new Error('Effect: missing depends')
            }

            let parent: EffectsRoot

            if (Array.isArray(deps)) {
                parent = deps[0]!
            } else {
                parent = deps

                if (!parent) {
                    throw new Error('Effect: missing parent')
                }
            }

            this.__parents = []

            if (Array.isArray(deps)) {
                let group: undefined | string
                if (typeof deps[1] === 'string') {
                    group = deps[1]
                } else if (typeof deps[2] === 'string') {
                    group = deps[2]
                }

                this.addParent(parent, group)
            } else {
                this.addParent(parent)
            }

            if (Array.isArray(deps) && deps.length > 1) {
                this.addDeps(...(deps.slice(1) as EffectDep[]))
            }

            if (callback) {
                const destroy = callback.call(this, ...args)

                if (destroy) {
                    this.destroy = destroy
                }
            }
        }

        addParent(parent: EffectsRoot, group?: string): this {
            parent['__groups'] ??= []

            if (group) {
                const constructorAsGroups = this.constructor as never as {
                    groups: string[]
                    __groupsIndexes: Record<string, number>
                }

                if (!constructorAsGroups.groups) {
                    throw Error("haven't groups")
                }

                if (constructorAsGroups.groups) {
                    const groupIndex = constructorAsGroups.__groupsIndexes[group]
                    parent['__groups'][groupIndex] ??= []
                    parent['__groups'][groupIndex].push(this)
                }

                const groupIndex = constructorAsGroups.__groupsIndexes[group]

                if (groupIndex == null) {
                    throw Error('unknown group')
                }

                parent['__groups'][groupIndex] ??= []
                parent['__groups'][groupIndex].push(this)
            } else {
                parent['__groups'][0] ??= []
                parent['__groups'][0].push(this)
            }

            if (parent['__contexts']) {
                new Promise<void>(resolve => resolve()).then(() => {
                    this.__addContexts({
                        ...(parent['__contexts'] as Record<string, { constructor: unknown }>),
                    })
                })
            }

            return this
        }

        removeParents(...parents: EffectsRoot[]): this {
            parents.forEach(parent => {
                this.__parents.remove(parent)
                parent['__groups']!.forEach(group => group.remove(this))

                if (parent['__contexts']) {
                    this['__removeContexts'](parent['__contexts'])
                }
            })

            if (this.__parents.length === 0) {
                this.destroy()
            }

            return this
        }

        isParent(parent: EffectsRoot): boolean {
            return !!parent['__groups']?.find(group => group.find(link => link === this))
        }

        addDeps(...deps: (string | EffectDep)[]): this {
            this.__depends ??= []
            this.__depends.push(
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

                if ((this as never as { [x: string]: Function })[`on${k}Context`]) {
                    const destroy = (this as never as { [x: string]: Function })[`on${k}Context`](
                        context
                    )

                    if (destroy) {
                        const Context = context.constructor as Context
                        new Effect(() => destroy, [this, Context])
                    }
                }
            })

            if (this['__groups']) {
                this['__groups'].forEach(group =>
                    group.forEach(link => link['__addContexts'](contexts))
                )
            }
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

            if (this['__groups']) {
                this['__groups'].forEach(group =>
                    group.forEach(link => link['__removeContexts'](contexts))
                )
            }
        }

        private __parents!: EffectsRoot[]
        private __depends!: EffectsRoot[]
        private __contextEffects!: Record<string, Effect[]>
    }

    Effect.prototype['__destroy'] = async function (this: Effect): Promise<void> {
        if (this['__parents']) {
            this['__parents'].forEach(parent => {
                if (parent['__isDestroyed'] !== undefined) {
                    parent['__groups']!.forEach(group => group.remove(this))
                }
            })
        }

        if (this['__depends']) {
            this['__depends'].forEach(dep => {
                if (dep['__isDestroyed'] === undefined) {
                    dep['__effects']!.remove(this)
                }
            })
        }

        await EffectsRoot.prototype['__destroy'].call(this)
    }
}

globalify(lib)
