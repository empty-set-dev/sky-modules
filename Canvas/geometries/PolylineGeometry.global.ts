import globalify from '@sky-modules/core/globalify'

import * as imports from './PolylineGeometry'

declare global {
    const PolylineGeometry: typeof imports.PolylineGeometry
    type Point = imports.Point
    type PolylineOptions = imports.PolylineOptions
}

globalify({ ...imports })
