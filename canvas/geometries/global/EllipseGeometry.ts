import globalify from '@sky-modules/core/globalify'

import * as imports from '../EllipseGeometry'

declare global {
    const EllipseGeometry: typeof imports.EllipseGeometry
}

globalify({ ...imports })
