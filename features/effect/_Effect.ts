import globalify from 'sky/helpers/globalify'

import './_Root'

declare global {
    function effect(constructor: Function): void
    type EffectDep = Root | Context | [Context]
    type EffectDeps = Root | [parent: Root, ...deps: (EffectDep | [EffectDep])[]]
    type Context<T extends { new (...args: ConstructorParameters<T>): InstanceType<T> } = never> = {
        new (...args: ConstructorParameters<T>): InstanceType<T>
        context: string
    }
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const thisAsAny = this as any

            if (thisAsAny['__initContexts']) {
                const contexts = thisAsAny['__initContexts']
                delete thisAsAny['__initContexts']
                thisAsAny['__addContexts'](contexts)
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
            ;(callback as null) = null
        }

        if (!deps) {
            throw new Error('Effect: missing deps')
        }

        if (!Effect.getParent(deps)) {
            throw new Error('Effect: missing parent')
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parent = Effect.getParent(deps) as any
        this.__linksCount = 1
        this.__parents = []
        this.__parents.push(parent)
        parent['__links'] ??= []
        parent['__links'].push(this)

        if (this.constructor !== Effect && parent['__contexts']) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(this as any)['__initContexts'] = { ...parent['__contexts'] }
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parents.forEach((parent: any) => {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parents.forEach((parent: any) => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return !!(parent as any)['__links'].find(this)
    }

    addDeps(...deps: (EffectDep | [EffectDep])[]): this {
        this.__depends ??= []
        this.__depends.push(...(deps.filter(dep => !Array.isArray(dep)) as Effect[]))

        deps.forEach(dep => {
            if (Array.isArray(dep)) {
                dep = dep[0]
                const Context = dep.constructor as Context
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contextOwner = this.__parents[0] as any
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner['__contextEffects'] ??= {}
                contextOwner['__contextEffects'][Context.context] ??= []
                contextOwner['__contextEffects'][Context.context].push([dep, this])
            } else if (typeof dep.context === 'string') {
                const Context = dep as Context
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contextOwner = this.__parents[0] as any
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner['__contextEffects'] ??= {}
                contextOwner['__contextEffects'][Context.context] ??= []
                contextOwner['__contextEffects'][Context.context].push([this])
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(dep as any)['__effects'] ??= []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(dep as any)['__effects'].push(this)
            }
        })

        return this
    }

    private __addContexts(contexts: object): void {
        this.__contexts ??= {}

        Object.keys(contexts).forEach(k => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const context = (contexts as any)[k]

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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((this as any)[`on${k}`]) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const destroy = (this as any)[`on${k}`](context)

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

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((this as any)[`on${k}`]) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const destroy = (this as any)[`on${k}`](context)

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

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (Array.isArray((contexts as any)[k])) {
                    await Promise.all(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (contexts as any)[k].map(async (context: any) => {
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (dep[0] === (contexts as any)[k]) {
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
    private __links!: Effect[]
    private __parents: Root[]
    private __depends!: EffectDep[]
    private __contexts!: Record<string, Root | Root[]>
    private __contextEffects!: Record<string, Root | Root[]>
}

globalify({ effect, Effect })
