import globalify from '@sky-modules/core/globalify'

import startRuntime, * as imports from './startRuntime'

declare global {
    const startRuntime: typeof imports.default
    type startRuntime = typeof imports.default
}

globalify({ startRuntime })
