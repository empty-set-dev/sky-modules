import globalify from '@sky-modules/core/globalify'

import isRuntime, * as imports from './isRuntime'

declare global {
    const isRuntime: typeof imports.default
}

globalify({ isRuntime })
