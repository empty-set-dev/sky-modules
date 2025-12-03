import globalify from '@sky-modules/core/globalify'

import Canvas, * as imports from '../Canvas.lite'

declare global {
    const Canvas: typeof imports.default
    type Canvas = typeof imports.default
    type CanvasProps = imports.CanvasProps
}

globalify({ Canvas })
