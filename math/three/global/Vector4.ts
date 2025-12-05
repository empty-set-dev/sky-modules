import globalify from '@sky-modules/core/globalify'

import * as imports from '../Vector4'

declare global {
    const Vector4: typeof imports.Vector4
}

globalify({ ...imports })
