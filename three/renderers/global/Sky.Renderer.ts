import globalify from '@sky-modules/core/globalify'

import * as imports from '../Sky.Renderer'

declare global {
    const Renderer: typeof imports.Renderer
}

globalify({ ...imports })
