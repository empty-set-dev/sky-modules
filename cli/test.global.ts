import globalify from '@sky-modules/core/globalify'

import test, * as imports from './test'

declare global {
    const test: typeof imports.default
    type test = typeof imports.default
}

globalify({ test })
