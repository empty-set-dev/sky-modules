import globalify from '@sky-modules/core/globalify'

import TiledPlaneView, * as imports from '../TiledPlaneView'

declare global {
    const TiledPlaneView: typeof imports.default
    type TiledPlaneView = typeof imports.default
    type TiledPlaneViewParameters = imports.TiledPlaneViewParameters
}

globalify({ TiledPlaneView })
