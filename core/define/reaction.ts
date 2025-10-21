import internal from './Internal'

declare global {
    type reaction = typeof lib.reaction
    const reaction: typeof lib.reaction
}

namespace lib {
    export function reaction(reaction: () => void): void {
        internal.reactions.push(reaction)
        reaction()
        internal.reactions.pop()
    }
}

Object.assign(global, lib)
