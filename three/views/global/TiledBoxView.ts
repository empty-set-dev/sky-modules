import globalify from '@sky-modules/core/globalify'

import TiledBoxView, * as imports from '../TiledBoxView'

declare global {
    const TiledBoxView: typeof imports.default
    type TiledBoxView = typeof imports.default
    type TiledBoxViewParameters = imports.TiledBoxViewParameters
}

globalify({ TiledBoxView })
