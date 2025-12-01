import globalify from '@sky-modules/core/globalify'

import Scene, * as imports from '../Scene'

declare global {
    const Scene: typeof imports.default
    type Scene = typeof imports.default
}

globalify({ Scene, ...imports })
