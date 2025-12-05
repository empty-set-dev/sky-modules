import globalify from '@sky-modules/core/globalify'

import CanvasRenderer from '../CanvasRenderer'

declare global {
    const CanvasRenderer: typeof CanvasRenderer
    type CanvasRenderer = typeof CanvasRenderer
}

globalify({ CanvasRenderer })
