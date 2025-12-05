import globalify from '@sky-modules/core/globalify'

import TiledBoxGeometry, * as imports from '../TiledBoxGeometry'

declare global {
    const TiledBoxGeometry: typeof imports.default
    type TiledBoxGeometry = typeof imports.default
    type TiledBoxGeometryParameters = imports.TiledBoxGeometryParameters
}

globalify({ TiledBoxGeometry })
