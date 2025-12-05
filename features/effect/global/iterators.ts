import globalify from '@sky-modules/core/globalify'

import * as imports from '../iterators'

declare global {
    const DFSIterator: typeof imports.DFSIterator
    const DFSPostOrderIterator: typeof imports.DFSPostOrderIterator
    const BFSIterator: typeof imports.BFSIterator
    const EffectTreeTraversal: typeof imports.EffectTreeTraversal
}

globalify({ ...imports })
