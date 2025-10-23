import globalify from '@sky-modules/core/globalify'

import runtime, * as imports from './runtime'

declare global {
    const runtime: typeof imports.default
    const isHot: typeof imports.isHot
}

globalify({ runtime, ...imports })
