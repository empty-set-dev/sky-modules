import globalify from '@sky-modules/core/globalify'

import * as imports from '../Line3'

declare global {
    const Line3: typeof imports.Line3
}

globalify({ ...imports })
