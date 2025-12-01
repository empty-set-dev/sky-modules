import globalify from '@sky-modules/core/globalify'

import * as imports from '../SplineGeometry'

declare global {
    const SplineGeometry: typeof imports.SplineGeometry
    type SplinePoint = imports.SplinePoint
    type SplineType = imports.SplineType
}

globalify({ ...imports })
