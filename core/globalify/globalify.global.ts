import globalify from '@sky-modules/core/globalify'

import globalify, * as imports from './globalify'

declare global {
    const globalify: typeof imports.default
    type globalify = typeof imports.default
}

globalify({ globalify, ...imports })
