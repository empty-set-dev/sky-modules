import globalify from '@sky-modules/core/globalify'

import * as imports from '../ScrollbarConfig'

declare global {
    const defaultScrollbarConfig: typeof imports.defaultScrollbarConfig
}

globalify({ ...imports })
