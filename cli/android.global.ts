import globalify from '@sky-modules/core/globalify'

import android, * as imports from './android'

declare global {
    const android: typeof imports.default
    type android = typeof imports.default
}

globalify({ android })
