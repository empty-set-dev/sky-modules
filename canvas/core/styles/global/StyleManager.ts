import globalify from '@sky-modules/core/globalify'

import * as imports from '../StyleManager'

declare global {
    const StyleManager: typeof imports.StyleManager
}

globalify({ ...imports })
