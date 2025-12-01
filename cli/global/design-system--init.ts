import globalify from '@sky-modules/core/globalify'

import designSystemInit, * as imports from '../design-system--init'

declare global {
    const designSystemInit: typeof imports.default
    type designSystemInit = typeof imports.default
}

globalify({ designSystemInit })
