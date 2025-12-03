import globalify from '@sky-modules/core/globalify'

import * as imports from '../CubicInterpolant'

declare global {
    const CubicInterpolant: typeof imports.CubicInterpolant
}

globalify({ ...imports })
