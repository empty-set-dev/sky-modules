import globalify from '@sky-modules/core/globalify'

import * as imports from '../Matrix3'

declare global {
    const Matrix3: typeof imports.Matrix3
}

globalify({ ...imports })
