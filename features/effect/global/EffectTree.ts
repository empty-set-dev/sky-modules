import globalify from '@sky-modules/core/globalify'

import EffectTree, * as imports from '../EffectTree'

declare global {
    const EffectTree: typeof imports.default
    type EffectTree = typeof imports.default
}

globalify({ EffectTree })
