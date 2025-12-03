import globalify from '@sky-modules/core/globalify'

import * as imports from '../ScrollbarRenderer'

declare global {
    const ScrollbarRenderer: typeof imports.ScrollbarRenderer
    type ScrollbarRenderParams = imports.ScrollbarRenderParams
}

globalify({ ...imports })
