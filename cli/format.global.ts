import globalify from '@sky-modules/core/globalify'

import format, * as imports from './format'

declare global {
    const format: typeof imports.default
    type format = typeof imports.default
}

globalify({ format })
