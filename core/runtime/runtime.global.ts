import globalify from '@sky-modules/core/globalify'

import runtime, * as imports from './runtime'

declare global {
    const runtime: typeof imports.default
    type runtime = typeof imports.default
}

globalify({ runtime })
