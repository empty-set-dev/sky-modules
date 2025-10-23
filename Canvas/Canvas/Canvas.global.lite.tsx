import globalify from '@sky-modules/core/globalify'

import Canvas.lite, * as imports from './Canvas.lite'

declare global {
    const Canvas.lite: typeof imports.default
    type Canvas.lite = typeof imports.default
    type CanvasProps = imports.CanvasProps
}

globalify({ Canvas.lite, ...imports })
