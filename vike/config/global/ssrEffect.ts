import globalify from '@sky-modules/core/globalify'

import ssrEffect, * as imports from '../ssrEffect'

declare global {
    const ssrEffect: typeof imports.default
    type ssrEffect = typeof imports.default
    const ssr: typeof imports.ssr
}

globalify({ ssrEffect, ...imports })
