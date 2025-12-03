import globalify from '@sky-modules/core/globalify'

import * as imports from '../CircleGeometry'

declare global {
    const CircleGeometry: typeof imports.CircleGeometry
    type CircleGeometryProps = imports.CircleGeometryProps
}

globalify({ ...imports })
