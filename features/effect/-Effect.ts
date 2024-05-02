import globalify from 'helpers/globalify'

import {
    __CONTEXTS,
    __CONTEXTS_EFFECTS,
    __DEPS,
    __EFFECTS,
    __INIT_CONTEXT,
    __LINKS,
    __LINKS_COUNT,
    __PARENTS,
} from './__'

import './-Root'

declare global {
    function effect(constructor: Function): void
    type EffectDep = Root | Context
    type EffectDeps = Root | [parent: Root, ...deps: EffectDep[]]
    type Context = { new (...args: unknown[]): unknown; context: string }
    class Effect<A extends unknown[] = []> extends Root {
        constructor(deps: EffectDeps)
        constructor(
            callback: (...args: A) => () => void | Promise<void>,
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

            if (this[__INIT_CONTEXT]) {
                const context = this[__INIT_CONTEXT]
                delete this[__INIT_CONTEXT]
                this['__addContext'](context)
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
        this[__LINKS_COUNT] = 1
        this[__PARENTS] = []
        this[__PARENTS].push(parent)
        parent[__LINKS] ??= []
        parent[__LINKS].push(this)
        if (parent[__CONTEXTS]) {
            this[__INIT_CONTEXT] = parent[__CONTEXTS]
        }

        if (Array.isArray(deps)) {
            this.addDeps(...deps.slice(1))
        }

        if (callback) {
            this.destroy = callback(...args)
        }
    }

    addParents(...parents: Root[]): this {
        this[__LINKS_COUNT] += parents.length

        parents.forEach(parent => {
            if ((parent.constructor as Context).context && this[__PARENTS].length > 0) {
                this[__PARENTS].forEach(parent_ => {
                    const { context } = parent_.constructor as Context
                    if (context === (parent.constructor as Context).context) {
                        this[__PARENTS].remove(parent_)
                        parent_[__LINKS].remove(this)
                        this['__removeContext'](parent_[__CONTEXTS])
                    }
                })
            }

            this[__PARENTS].push(parent)
            parent[__LINKS] ??= []
            parent[__LINKS].push(this)
            if (parent[__CONTEXTS]) {
                this['__addContext'](parent[__CONTEXTS])
            }
        })

        return this
    }

    removeParents(...parents: Root[]): this {
        this[__LINKS_COUNT] -= parents.length

        parents.forEach(parent => {
            this[__PARENTS].remove(parent)
            parent[__LINKS].remove(this)
            if (parent[__CONTEXTS]) {
                this['__removeContext'](parent[__CONTEXTS])
            }
        })

        if (this[__LINKS_COUNT] === 0) {
            this.destroy()
        }

        return this
    }

    isParent(parent: Root): boolean {
        return !!parent[__LINKS].find(this)
    }

    addDeps(...deps: EffectDep[]): this {
        this[__DEPS] ??= []
        this[__DEPS].push(...deps)

        deps.forEach(dep => {
            if (typeof dep.context === 'symbol') {
                const Context = dep as Context
                const contextOwner = this[__PARENTS][0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner[__CONTEXTS_EFFECTS] ??= {}
                contextOwner[__CONTEXTS_EFFECTS][Context.context] ??= []
                contextOwner[__CONTEXTS_EFFECTS][Context.context].push(this)
            } else {
                dep[__EFFECTS] ??= []
                dep[__EFFECTS].push(this)
            }
        })

        return this
    }

    private __addContext(context: object): void {
        this[__CONTEXTS] ??= {}
        Object.assign(this[__CONTEXTS], context)
        Object.keys(context).forEach(k => {
            if (this[`on${k}`]) {
                this[`on${k}`]()
            }
        })

        if (this[__LINKS]) {
            this[__LINKS].forEach(link => link['__addContext'](context))
        }
    }

    private __removeContext(context: object): void {
        Object.keys(context).forEach(k => {
            delete this[__CONTEXTS][k]
            if (this[__CONTEXTS_EFFECTS] && this[__CONTEXTS_EFFECTS][k]) {
                this[__CONTEXTS_EFFECTS][k].forEach(effect => effect.destroy())
            }
        })

        if (this[__LINKS]) {
            this[__LINKS].forEach(link => link['__removeContext'](context))
        }
    }

    private [__LINKS_COUNT] = 0
    private [__PARENTS]?: Root[]
}

globalify({ effect, Effect })
