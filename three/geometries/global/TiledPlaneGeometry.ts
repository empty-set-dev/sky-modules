import globalify from '@sky-modules/core/globalify'

import TiledPlaneGeometry, * as imports from '../TiledPlaneGeometry'

declare global {
    const TiledPlaneGeometry: typeof imports.default
    type TiledPlaneGeometry = typeof imports.default
    type TiledPlaneGeometryParameters = imports.TiledPlaneGeometryParameters
}

globalify({ TiledPlaneGeometry })
