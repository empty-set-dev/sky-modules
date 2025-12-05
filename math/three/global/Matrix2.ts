import globalify from '@sky-modules/core/globalify'

import * as imports from '../Matrix2'

declare global {
    const Matrix2: typeof imports.Matrix2
}

globalify({ ...imports })
