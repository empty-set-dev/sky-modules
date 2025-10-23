import globalify from '@sky-modules/core/globalify'

import * as imports from './async'

declare global {
    const fire: typeof imports.fire
    const task: typeof imports.task
    const handleAsyncError: typeof imports.handleAsyncError
}

globalify({ ...imports })
