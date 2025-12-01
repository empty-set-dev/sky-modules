import globalify from '@sky-modules/core/globalify'

import * as imports from '../share'

declare global {
    const share: typeof imports.share
    const unshare: typeof imports.unshare
}

globalify({ ...imports })
