import globalify from '@sky-modules/core/globalify'

import * as imports from '../Interpolant'

declare global {
    const Interpolant: typeof imports.Interpolant
}

globalify({ ...imports })
