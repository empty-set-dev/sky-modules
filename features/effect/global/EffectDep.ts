import globalify from '@sky-modules/core/globalify'

import * as imports from '../EffectDep'

declare global {
    type EffectDep = imports.default
}

// No runtime values to globalize
