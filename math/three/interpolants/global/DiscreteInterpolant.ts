import globalify from '@sky-modules/core/globalify'

import * as imports from '../DiscreteInterpolant'

declare global {
    const DiscreteInterpolant: typeof imports.DiscreteInterpolant
}

globalify({ ...imports })
