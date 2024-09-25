import globalify from 'sky/helpers/globalify'

import Root from './_Root'

declare global {
    function effect(constructor: Function): void

    type EffectDep = Root | Context
    type EffectDeps = Root | [parent: Root, ...deps: EffectDep[]]

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

function effect(constructor: { new (...args: unknown[]): Effect }): unknown {
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

export default class Effect<A extends unknown[] = []> extends Root {
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

        let parent: Root

        if (Array.isArray(deps)) {
            parent = deps[0]
        } else {
            parent = deps
        }

        if (!parent) {
            throw new Error('Effect: missing parent')
        }

        this.__parents = [parent]
        parent['__links'] ??= []
        parent['__links'].push(this)

        if (this.constructor !== Effect && parent['__contexts']) {
            this.__initContexts = { ...parent['__contexts'] }
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
        parents.forEach(parent => {
            this.__parents.push(parent)
            parent['__links'] ??= []
            parent['__links'].push(this)

            if (parent['__contexts']) {
                this['__addContexts'](
                    parent['__contexts'] as Record<string, { constructor: unknown }>
                )
            }
        })

        return this
    }

    removeParents(...parents: Root[]): this {
        parents.forEach(parent => {
            this.__parents.remove(parent)
            parent['__links']!.remove(this)

            if (parent['__contexts']) {
                this['__removeContexts'](parent['__contexts'])
            }
        })

        if (this.__parents.length === 0) {
            this.destroy()
        }

        return this
    }

    isParent(parent: Root): boolean {
        return !!parent['__links']?.find(link => link === this)
    }

    addDeps(...deps: EffectDep[]): this {
        this.__depends ??= []
        this.__depends.push(...(deps.filter(dep => dep.constructor) as Effect[]))

        deps.forEach(dep => {
            if (dep.constructor) {
                dep = dep as Root
                dep['__effects'] ??= []
                dep['__effects'].push(this)
            } else {
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
            }
        })

        return this
    }

    private __addContexts(contexts: Record<string, { constructor: unknown }>): void {
        this['__contexts'] ??= {}

        Object.keys(contexts).forEach(k => {
            const context = contexts[k]
            this['__contexts']![k] = context

            if ((this as unknown as { [x: string]: Function })[`on${k}`]) {
                const destroy = (this as unknown as { [x: string]: Function })[`on${k}`](context)

                if (destroy) {
                    const Context = context.constructor as Context
                    new Effect(() => destroy, [this, Context])
                }
            }
        })

        if (this['__links']) {
            this['__links'].forEach(link => link['__addContexts'](contexts))
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

        if (this['__links']) {
            this['__links'].forEach(link => link['__removeContexts'](contexts))
        }
    }

    private __parents: Root[]
    private __depends?: Root[]
    private __contextEffects?: Record<string, Effect[]>
    private __initContexts?: Record<string, { constructor: unknown }>
}

Effect.prototype['__destroy'] = async function (this: Effect): Promise<void> {
    if (this['__parents']) {
        this['__parents'].forEach(parent => {
            if (parent['__isDestroyed'] !== undefined) {
                parent['__links']!.remove(this)
            }
        })
    }

    if (this['__depends']) {
        const contextOwner = this['__parents'][0]
        this['__depends'].forEach(dep => {
            if (typeof dep.context !== 'string') {
                if (dep['__isDestroyed'] === undefined) {
                    dep['__effects']!.remove(this)
                }
            } else {
                if (contextOwner['__isDestroyed'] === undefined) {
                    contextOwner['__contextEffects']![dep['context']].remove(this)
                }
            }
        })
    }

    await Root.prototype['__destroy'].call(this)
}

globalify({ effect, Effect })
