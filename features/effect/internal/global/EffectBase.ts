import globalify from '@sky-modules/core/globalify'

import abstract, * as imports from '../EffectBase'

declare global {
    const abstract: typeof imports.default
    type abstract = typeof imports.default
}

globalify({ abstract })
