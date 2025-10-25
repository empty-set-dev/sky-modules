import globalify from '@sky-modules/core/globalify'

import * as imports from './async'

declare global {
    const fire: typeof imports.fire
    const handleAsyncError: typeof imports.handleAsyncError
}

globalify({ ...imports })
