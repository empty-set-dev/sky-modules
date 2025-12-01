import globalify from '@sky-modules/core/globalify'

import * as imports from '../PathGeometry'

declare global {
    const PathGeometry: typeof imports.PathGeometry
}

globalify({ ...imports })
