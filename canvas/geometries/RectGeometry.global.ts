import globalify from '@sky-modules/core/globalify'

import * as imports from './RectGeometry'

declare global {
    const RectGeometry: typeof imports.RectGeometry
}

globalify({ ...imports })
