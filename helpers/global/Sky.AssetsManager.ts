import globalify from '@sky-modules/core/globalify'

import * as imports from '../Sky.AssetsManager'

declare global {
    const AssetsManager: typeof imports.AssetsManager
    type LoadTextureParameters = imports.LoadTextureParameters
}

globalify({ ...imports })
