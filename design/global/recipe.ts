import globalify from '@sky-modules/core/globalify'

import * as imports from '../recipe'

declare global {
    const tv: typeof imports.tv
}

globalify({ ...imports })
