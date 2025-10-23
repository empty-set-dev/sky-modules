import globalify from '@sky-modules/core/globalify'

import deferred, * as imports from './deferred'

declare global {
    const deferred: typeof imports.default
}

globalify({ deferred, ...imports })
