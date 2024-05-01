import globalify from 'helpers/globalify'

import { __CONTEXTS_EFFECTS, __EFFECTS } from './__'
import './-Link'

declare global {
    class Effect<A extends unknown[] = []> extends Root {
        constructor(
            callback: (...args: A) => () => void | Promise<void>,
            deps: EffectDeps,
            ...args: A
        )
        constructor(deps: EffectDeps)
    }

    type EffectDeps = [parent: Parent, ...deps: (Parent | { context: Symbol })[]]
}

class Effect<A extends unknown[] = []> extends Root {
    constructor(
        callback?: (...args: A) => () => void | Promise<void>,
        deps?: EffectDeps,
        ...args: A
    ) {
        super()

        if (callback && Array.isArray(callback) && callback[0]) {
            this.addDeps(...(callback as unknown as EffectDeps))
            return
        }

        if (!callback || !deps || !deps[0]) {
            throw new Error('Effect: missing deps')
        }

        this.addDeps(...deps)
        this.destroy = callback(...args)
    }

    addDeps(...deps: EffectDeps): this {
        this['__deps'].push(...deps)

        deps.forEach(dep => {
            if (typeof dep.context === 'symbol') {
                const Context = dep as { new (...args: unknown[]): unknown; context: symbol }
                const contextOwner = this['__deps'][0] as Root
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

    private __deps: EffectDeps = [] as never
}

globalify({ Effect })
