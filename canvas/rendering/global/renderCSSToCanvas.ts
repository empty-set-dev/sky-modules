import globalify from '@sky-modules/core/globalify'

import renderCSSToCanvas, * as imports from '../renderCSSToCanvas'

declare global {
    const renderCSSToCanvas: typeof imports.default
    type renderCSSToCanvas = typeof imports.default
    type CSSProperties = imports.CSSProperties
    type RenderOptions = imports.RenderOptions
    type ChildElement = imports.ChildElement
}

globalify({ renderCSSToCanvas, ...imports })
