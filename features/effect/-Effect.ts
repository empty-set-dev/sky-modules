import globalify from 'sky/helpers/globalify'

import {
    __ContextsSymbol,
    __ContextEffectsSymbol,
    __DepsSymbol,
    __EffectsSymbol,
    __InitContextsSymbol,
    __LinksSymbol,
    __LinksCountSymbol,
    __ParentsSymbol,
} from './__'

import './-Root'

declare global {
    function effect(constructor: Function): void
    type EffectDep = Root | Context
    type EffectDeps = Root | [parent: Root, ...deps: EffectDep[]]
    type Context = { new (...args: unknown[]): unknown; context: string }
    type Destructor = () => void | Promise<void>
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

            if (this[__InitContextsSymbol]) {
                const contexts = this[__InitContextsSymbol]
                delete this[__InitContextsSymbol]
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
        this[__LinksCountSymbol] = 1
        this[__ParentsSymbol] = []
        this[__ParentsSymbol].push(parent)
        parent[__LinksSymbol] ??= []
        parent[__LinksSymbol].push(this)

        if (parent[__ContextsSymbol]) {
            this[__InitContextsSymbol] = parent[__ContextsSymbol]
        }

        if (Array.isArray(deps)) {
            this.addDeps(...deps.slice(1))
        }

        if (callback) {
            this.destroy = callback(...args)
        }
    }

    addParents(...parents: Root[]): this {
        this[__LinksCountSymbol] += parents.length

        parents.forEach(parent => {
            this[__ParentsSymbol].push(parent)
            parent[__LinksSymbol] ??= []
            parent[__LinksSymbol].push(this)

            if (parent[__ContextsSymbol]) {
                this['__addContexts'](parent[__ContextsSymbol])
            }
        })

        return this
    }

    removeParents(...parents: Root[]): this {
        this[__LinksCountSymbol] -= parents.length

        parents.forEach(parent => {
            this[__ParentsSymbol].remove(parent)
            parent[__LinksSymbol].remove(this)

            if (parent[__ContextsSymbol]) {
                this['__removeContexts'](parent[__ContextsSymbol])
            }
        })

        if (this[__LinksCountSymbol] === 0) {
            this.destroy()
        }

        return this
    }

    isParent(parent: Root): boolean {
        return !!parent[__LinksSymbol].find(this)
    }

    addDeps(...deps: EffectDep[]): this {
        this[__DepsSymbol] ??= []
        this[__DepsSymbol].push(...deps)

        deps.forEach(dep => {
            if (typeof dep.context === 'string') {
                const Context = dep as Context
                const contextOwner = this[__ParentsSymbol][0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('context missing')
                }

                contextOwner[__ContextEffectsSymbol] ??= {}
                contextOwner[__ContextEffectsSymbol][Context.context] ??= []
                contextOwner[__ContextEffectsSymbol][Context.context].push(this)
            } else {
                dep[__EffectsSymbol] ??= []
                dep[__EffectsSymbol].push(this)
            }
        })

        return this
    }

    private __addContexts(contexts: object): void {
        this[__ContextsSymbol] ??= {}
        Object.assign(this[__ContextsSymbol], contexts)

        Object.keys(contexts).forEach(k => {
            if (this[`on${k}`]) {
                const destroy = this[`on${k}`]()

                if (destroy) {
                    const context = contexts[k]
                    new Effect(() => destroy, [this, context])
                }
            }
        })

        if (this[__LinksSymbol]) {
            this[__LinksSymbol].forEach(link => link['__addContexts'](contexts))
        }
    }

    private __removeContexts(contexts: object): void {
        Object.keys(contexts).forEach(k => {
            if (this[__ContextEffectsSymbol] && this[__ContextEffectsSymbol][k]) {
                this[__ContextEffectsSymbol][k].forEach(effect => effect.destroy())
            }

            delete this[__ContextsSymbol][k]
        })

        if (this[__LinksSymbol]) {
            this[__LinksSymbol].forEach(link => link['__removeContexts'](contexts))
        }
    }

    private [__LinksCountSymbol] = 0
    private [__ParentsSymbol]?: Root[]
}

globalify({ effect, Effect })
