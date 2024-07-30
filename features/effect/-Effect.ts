import globalify from 'sky/helpers/globalify'

import './-Root'

declare global {
    function effect(constructor: Function): void
    type EffectDep = Root | Context | [Context]
    type EffectDeps = Root | [parent: Root, ...deps: (EffectDep | [EffectDep])[]]
    type Context = { new (...args: unknown[]): unknown; context: string }
    type Destructor = () => void | Promise<void>
    class Effect<A extends unknown[] = []> extends Root {
        constructor(deps: EffectDeps)
        constructor(
            callback: (...args: A) => void | (() => void | Promise<void>),
            deps: EffectDeps,
            ...args: A
        )
        addParents(...parents: Root[]): this
        removeParents(...parents: Root[]): this
        isParent(parent: Root): boolean
        addDeps(...deps: EffectDep[]): this
        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

function effect(constructor: { new (...args: unknown[]): {} }): unknown {
    return class extends constructor {
        constructor(...args: unknown[]) {
            super(...args)

            if (this['__initContexts']) {
                const contexts = this['__initContexts']
                delete this['__initContexts']
                this['__addContexts'](contexts)
            }
        }
    }
}

class Effect<A extends unknown[] = []> extends Root {
    static getParent(deps: EffectDeps): Root {
        if (Array.isArray(deps)) {
            return deps[0]
        }

        return deps as Root
    }

    constructor(
        callback: (...args: A) => () => void | Promise<void>,
        deps?: EffectDeps,
        ...args: A
    ) {
        super()

        if (callback && typeof callback !== 'function') {
            deps = callback as unknown as EffectDeps
            callback = null
        }

        if (!deps) {
            throw new Error('Effect: missing deps')
        }

        if (!Effect.getParent(deps)) {
            throw new Error('Effect: missing parent')
        }

        const parent = Effect.getParent(deps)
        this.__linksCount = 1
        this.__parents = []
        this.__parents.push(parent)
        parent['__links'] ??= []
        parent['__links'].push(this)

        if (this.constructor !== Effect && parent['__contexts']) {
            this['__initContexts'] = { ...parent['__contexts'] }
        }

        if (Array.isArray(deps)) {
            this.addDeps(...deps.slice(1))
        }

        if (callback) {
            const destroy = callback.call(this, ...args)

            if (destroy) {
                this.destroy = destroy
            }
        }
    }

    addParents(...parents: Root[]): this {
        this.__linksCount += parents.length

        parents.forEach(parent => {
            this.__parents.push(parent)
            parent['__links'] ??= []
            parent['__links'].push(this)

            if (parent['__contexts']) {
                this['__addContexts'](parent['__contexts'])
            }
        })

        return this
    }

    removeParents(...parents: Root[]): this {
        this.__linksCount -= parents.length

        parents.forEach(parent => {
            this.__parents.remove(parent)
            parent['__links'].remove(this)

            if (parent['__contexts']) {
                this['__removeContexts'](parent['__contexts'])
            }
        })

        if (this.__linksCount === 0) {
            this.destroy()
        }

        return this
    }

    isParent(parent: Root): boolean {
        return !!parent['__links'].find(this)
    }

    addDeps(...deps: (EffectDep | [EffectDep])[]): this {
        this.__depends ??= []
        this.__depends.push(...(deps.filter(dep => !Array.isArray(dep)) as Effect[]))

        deps.forEach(dep => {
            if (Array.isArray(dep)) {
                dep = dep[0]
                const Context = dep.constructor as Context
                const contextOwner = this.__parents[0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner['__contextEffects'] ??= {}
                contextOwner['__contextEffects'][Context.context] ??= []
                contextOwner['__contextEffects'][Context.context].push([dep, this])
            } else if (typeof dep.context === 'string') {
                const Context = dep as Context
                const contextOwner = this.__parents[0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner['__contextEffects'] ??= {}
                contextOwner['__contextEffects'][Context.context] ??= []
                contextOwner['__contextEffects'][Context.context].push([this])
            } else {
                dep['__effects'] ??= []
                dep['__effects'].push(this)
            }
        })

        return this
    }

    private __addContexts(contexts: object): void {
        this.__contexts ??= {}

        Object.keys(contexts).forEach(k => {
            const context = contexts[k]

            if (Array.isArray(context)) {
                if (this.__contexts[k]) {
                    if (!Array.isArray(this.__contexts[k])) {
                        this.__contexts[k] = [this.__contexts[k]]
                    }

                    this.__contexts[k].push(...context)
                } else {
                    this.__contexts[k] = [...context]
                }

                context.forEach(context => {
                    if (this[`on${k}`]) {
                        const destroy = this[`on${k}`](context)

                        if (destroy) {
                            new Effect(() => destroy, [this, [context]])
                        }
                    }
                })
            } else {
                if (this.__contexts[k]) {
                    if (!Array.isArray(this.__contexts[k])) {
                        this.__contexts[k] = [this.__contexts[k]]
                    }

                    this.__contexts[k].push(context)
                } else {
                    this.__contexts[k] = context
                }

                if (this[`on${k}`]) {
                    const destroy = this[`on${k}`](context)

                    if (destroy) {
                        new Effect(() => destroy, [this, [context]])
                    }
                }
            }
        })

        if (this.__links) {
            this.__links.forEach(link => link['__addContexts'](contexts))
        }
    }

    private async __removeContexts(contexts: object): Promise<void> {
        await Promise.all(
            Object.keys(contexts).map(async k => {
                if (!this.__contextEffects || !this.__contextEffects[k]) {
                    return
                }

                if (Array.isArray(contexts[k])) {
                    await Promise.all(
                        contexts[k].map(async context => {
                            const list = this.__contextEffects[k] as Root[]
                            for (let i = list.length - 1; i >= 0; --i) {
                                const dep = list[i]
                                if (Array.isArray(dep)) {
                                    if (dep[0] === context) {
                                        list.splice(i, 1)
                                        await dep[1].destroy()
                                    }
                                }
                            }
                        })
                    )
                } else {
                    const list = this.__contextEffects[k] as Root[]
                    for (let i = list.length - 1; i >= 0; --i) {
                        const dep = list[i]
                        if (Array.isArray(dep)) {
                            if (dep[0] === contexts[k]) {
                                list.splice(i, 1)
                                await dep[1].destroy()
                            }
                        }
                    }
                }

                delete this.__contexts[k]
            })
        )

        if (this.__links) {
            this.__links.forEach(link => link['__removeContexts'](contexts))
        }
    }

    private __linksCount = 0
    private __links: Effect[]
    private __parents: Root[]
    private __depends: EffectDep[]
    private __contexts: Record<string, Root | Root[]>
    private __contextEffects: Record<string, Root | Root[]>
}

globalify({ effect, Effect })
