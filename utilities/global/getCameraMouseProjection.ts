import globalify from '@sky-modules/core/globalify'

import getCameraMouseProjection, * as imports from '../getCameraMouseProjection'

declare global {
    const getCameraMouseProjection: typeof imports.default
    type getCameraMouseProjection = typeof imports.default
}

globalify({ getCameraMouseProjection })
