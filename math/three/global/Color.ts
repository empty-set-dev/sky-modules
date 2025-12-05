import globalify from '@sky-modules/core/globalify'

import * as imports from '../Color'

declare global {
    const Color: typeof imports.Color
}

globalify({ ...imports })
