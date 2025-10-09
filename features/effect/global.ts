import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    type Effect = lib.Effect
    const Effect: typeof lib.Effect

    type EffectThree = typeof lib.EffectThree
    const EffectThree: typeof lib.EffectThree

    type ContextConstructor = lib.ContextConstructor
    type EffectDep = lib.EffectDep

    type DFSIterator = typeof lib.DFSIterator
    const DFSIterator: typeof lib.DFSIterator
    type DFSPostOrderIterator = typeof lib.DFSPostOrderIterator
    const DFSPostOrderIterator: typeof lib.DFSPostOrderIterator
    type BFSIterator = typeof lib.BFSIterator
    const BFSIterator: typeof lib.BFSIterator
    type EffectThreeTraversal = typeof lib.EffectThreeTraversal
    const EffectThreeTraversal: typeof lib.EffectThreeTraversal
}

globalify(lib)
