import local from './__local'

declare global {
    type reaction = typeof lib.reaction
    const reaction: typeof lib.reaction
}

namespace lib {
    export function reaction(reaction: () => void): void {
        local.reactions.push(reaction)
        reaction()
        local.reactions.pop()
    }
}

Object.assign(global, lib)