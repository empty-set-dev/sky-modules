import globalify from 'helpers/globalify'

import { __CONTEXTS_EFFECTS, __EFFECTS } from './__'
import './-Link'

declare global {
    class Effect<A extends unknown[] = []> extends Root {
        constructor(callback: (...args: A) => () => Promise<void>, deps: EffectDeps, ...args: A)
        constructor(deps: EffectDeps)
    }

    type EffectDeps = [parent: Parent, ...deps: (Parent | { context: Symbol })[]]
}

class Effect<A extends unknown[] = []> extends Root {
    constructor(callback?: (...args: A) => () => Promise<void>, deps?: EffectDeps, ...args: A) {
        super()

        if (callback && Array.isArray(callback) && callback[0] && callback[0] instanceof Root) {
            this['__contextOwner'] = callback[0]
            this.addDeps(...(callback as unknown as EffectDeps))
            return
        }

        if (!callback || !deps || !deps[0] || !(deps[0] instanceof Root)) {
            throw new Error('Effect: missing deps')
        }

        this['__contextOwner'] = deps[0]
        this.destroy = callback(...args)
        this.addDeps(...deps)
    }

    addDeps(...deps: EffectDeps): this {
        deps.forEach(dep => {
            if (!(dep instanceof Root)) {
                const Context = dep as { context: symbol }
                const context = this['__contextOwner'].context(Context as never)

                if (!context) {
                    throw new Error('context missing')
                }

                this['__contextOwner'][__CONTEXTS_EFFECTS] ??= {}
                this['__contextOwner'][__CONTEXTS_EFFECTS][Context.context] ??= []
                this['__contextOwner'][__CONTEXTS_EFFECTS][Context.context].push(this)
            }
            dep[__EFFECTS] ??= []
            dep[__EFFECTS].push(this)
        })

        return this
    }

    private __contextOwner: Parent
}

globalify({ Effect })
