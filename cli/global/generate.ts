import globalify from '@sky-modules/core/globalify'

import generate, * as imports from '../generate'

declare global {
    const generate: typeof imports.default
    type generate = typeof imports.default
}

globalify({ generate })
