import globalify from 'helpers/globalify'

import { __EFFECTS } from './__'
import './-Link'

declare global {
    class Effect<T = void, A extends unknown[] = []> extends Link<T, A> {
        constructor(
            callback?: () => (...args: A) => Promise<Awaited<T>>,
            links?: Root<unknown, unknown[]>[]
        )
    }
}

class Effect<T = void, A extends unknown[] = []> extends Root<T, A> {
    constructor(
        callback?: () => (...args: A) => Promise<Awaited<T>>,
        parents?: Root<unknown, unknown[]>[]
    ) {
        super()

        if (callback) {
            this.destroy = callback()
        }

        this.addParents(...parents)
    }

    addParents(...parents: Parent[]): this {
        parents.forEach(parent => {
            parent[__EFFECTS] ??= []
            parent[__EFFECTS].push(this)
        })

        return this
    }
}

globalify({ Effect })
