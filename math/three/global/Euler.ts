import globalify from '@sky-modules/core/globalify'

import * as imports from '../Euler'

declare global {
    const Euler: typeof imports.Euler
}

globalify({ ...imports })
