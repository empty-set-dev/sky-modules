import globalify from '@sky-modules/core/globalify'

import * as imports from './Canvas'

declare global {
    type Canvas = imports.default
    type CanvasRendererParameters = imports.CanvasRendererParameters
    type DrawHexagonParameters = imports.DrawHexagonParameters
}

globalify({ ...imports })
