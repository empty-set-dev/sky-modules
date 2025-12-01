import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    type Effect = lib.Effect
    const Effect: typeof lib.Effect

    type EffectTree = typeof lib.EffectTree
    const EffectTree: typeof lib.EffectTree

    type ContextConstructor = lib.ContextConstructor
    type EffectDep = lib.EffectDep

    type DFSIterator = typeof lib.DFSIterator
    const DFSIterator: typeof lib.DFSIterator
    type DFSPostOrderIterator = typeof lib.DFSPostOrderIterator
    const DFSPostOrderIterator: typeof lib.DFSPostOrderIterator
    type BFSIterator = typeof lib.BFSIterator
    const BFSIterator: typeof lib.BFSIterator
    type EffectTreeTraversal = typeof lib.EffectTreeTraversal
    const EffectTreeTraversal: typeof lib.EffectTreeTraversal
}

globalify(lib)
