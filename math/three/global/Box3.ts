import globalify from '@sky-modules/core/globalify'

import * as imports from '../Box3'

declare global {
    const Box3: typeof imports.Box3
}

globalify({ ...imports })
