import globalify from '@sky-modules/core/globalify'

import * as imports from './Callback'

declare global {
    type Callback = imports.default
    const invokeCallback: typeof imports.invokeCallback
    type invokeCallback = typeof imports.invokeCallback
}

globalify({ ...imports })
