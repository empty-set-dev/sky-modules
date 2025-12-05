import globalify from '@sky-modules/core/globalify'

import * as imports from '../Matrix4'

declare global {
    const Matrix4: typeof imports.Matrix4
}

globalify({ ...imports })
