import globalify from 'helpers/globalify'

import './-Root'
import { __CONTEXTS, __CONTEXTS_EFFECTS, __LINKS, __LINKS_COUNT } from './__'

declare global {
    class Link extends Root {
        constructor(parent: Parent)
        addParents(...parents: Parent[]): this
        removeParents(...parents: Parent[]): this
        isParent(parent: Parent): boolean

        emit(ev: Object.Index, ...args: unknown[]): this
    }
}

abstract class Link extends Root {
    private ___abstract: Link

    constructor(parent: Parent) {
        super()

        if (!parent || !(parent instanceof Root)) {
            throw new Error('parent missing')
        }

        this.addParents(parent)
    }

    addParents(...parents: Parent[]): this {
        this[__LINKS_COUNT] += parents.length

        parents.forEach(parent => {
            parent[__LINKS] ??= []
            parent[__LINKS].push(this)
            if (parent[__CONTEXTS]) {
                this['__addContext'](parent[__CONTEXTS])
            }
        })

        return this
    }

    removeParents(...parents: Parent[]): this {
        this[__LINKS_COUNT] -= parents.length

        parents.forEach(parent => {
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

    isParent(parent: Parent): boolean {
        return !!parent[__LINKS].find(this)
    }

    private [__LINKS_COUNT] = 0

    private __addContext(context: object): void {
        this[__CONTEXTS] ??= {}
        Object.assign(this[__CONTEXTS], context)
        if (this[__LINKS]) {
            this[__LINKS].forEach(link => link['__addContext'](context))
        }
    }

    private __removeContext(context: object): void {
        Object.getOwnPropertySymbols(context).forEach(k => {
            delete this[__CONTEXTS][k]
            if (this[__CONTEXTS_EFFECTS] && this[__CONTEXTS_EFFECTS][k]) {
                this[__CONTEXTS_EFFECTS][k].forEach(effect => effect.destroy())
            }
        })
        if (this[__LINKS]) {
            this[__LINKS].forEach(link => link['__removeContext'](context))
        }
    }
}

globalify({ Link })
