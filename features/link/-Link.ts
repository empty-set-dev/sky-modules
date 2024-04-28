import globalify from 'helpers/globalify'

import { __LINKS, __LINKS_COUNT } from './__'

declare global {
    class Link<T = void, A extends unknown[] = []> extends Parent {}
}

abstract class Link<T = void, A extends unknown[] = []> extends Parent {
    private ___abstract: Link<T, A>

    constructor(parents: Parent[]) {
        super()

        if (!parents || !parents[0] || !(parents[0] instanceof Parent)) {
            throw new Error('link missing')
        }

        parents.forEach(parent => parent.addLinks(this))
    }

    addParents(...parents: Parent[]): this {
        parents.forEach(parent => {
            parent[__LINKS] ??= []
            parent[__LINKS].push(this)
        })

        return this
    }

    private [__LINKS_COUNT] = 0
}

globalify({ Link })
