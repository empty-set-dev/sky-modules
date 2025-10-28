import globalify from '@sky-modules/core/globalify'

import reactive, * as imports from './reactive'

declare global {
    const reactive: typeof imports.default
}

globalify({ reactive })
