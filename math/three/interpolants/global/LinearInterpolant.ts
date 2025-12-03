import globalify from '@sky-modules/core/globalify'

import * as imports from '../LinearInterpolant'

declare global {
    const LinearInterpolant: typeof imports.LinearInterpolant
}

globalify({ ...imports })
