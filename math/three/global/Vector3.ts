import globalify from '@sky-modules/core/globalify'

import * as imports from '../Vector3'

declare global {
    const Vector3: typeof imports.Vector3
}

globalify({ ...imports })
