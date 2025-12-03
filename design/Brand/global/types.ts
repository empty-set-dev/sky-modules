import globalify from '@sky-modules/core/globalify'

import * as imports from '../types'

declare global {
    type ColorScale = imports.ColorScale
}

// No runtime values to globalize
