import globalify from '@sky-modules/core/globalify'

import * as imports from '../isTouchDevice'

declare global {
    const isTouchDevice: typeof imports.isTouchDevice
}

globalify({ ...imports })
