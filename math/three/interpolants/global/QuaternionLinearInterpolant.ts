import globalify from '@sky-modules/core/globalify'

import * as imports from '../QuaternionLinearInterpolant'

declare global {
    const QuaternionLinearInterpolant: typeof imports.QuaternionLinearInterpolant
}

globalify({ ...imports })
