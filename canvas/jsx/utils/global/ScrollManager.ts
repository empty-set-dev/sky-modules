import globalify from '@sky-modules/core/globalify'

import * as imports from '../ScrollManager'

declare global {
    const ScrollManager: typeof imports.ScrollManager
}

globalify({ ...imports })
