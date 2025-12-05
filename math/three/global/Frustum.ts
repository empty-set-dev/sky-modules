import globalify from '@sky-modules/core/globalify'

import * as imports from '../Frustum'

declare global {
    const Frustum: typeof imports.Frustum
}

globalify({ ...imports })
