import globalify from '@sky-modules/core/globalify'

import * as imports from './CanvasRenderer'

declare global {
    type CanvasRenderer = imports.default
}

globalify({ ...imports })
