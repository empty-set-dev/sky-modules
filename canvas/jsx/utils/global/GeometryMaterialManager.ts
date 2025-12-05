import globalify from '@sky-modules/core/globalify'

import * as imports from '../GeometryMaterialManager'

declare global {
    const GeometryMaterialManager: typeof imports.GeometryMaterialManager
}

globalify({ ...imports })
