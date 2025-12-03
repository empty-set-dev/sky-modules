import globalify from '@sky-modules/core/globalify'

import * as imports from '../TextGeometry'

declare global {
    const TextGeometry: typeof imports.TextGeometry
    type TextGeometryProps = imports.TextGeometryProps
}

globalify({ ...imports })
