import globalify from '@sky-modules/core/globalify'

import * as imports from '../text'

declare global {
    const parseTextShadow: typeof imports.parseTextShadow
    const applyTextStyles: typeof imports.applyTextStyles
    const renderText: typeof imports.renderText
    type ParsedShadow = imports.ParsedShadow
    type RenderTextOptions = imports.RenderTextOptions
}

globalify({ ...imports })
