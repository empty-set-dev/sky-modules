import globalify from '@sky-modules/core/globalify'

import makeReactive, * as imports from './makeReactive'

declare global {
    const makeReactive: typeof imports.default
}

globalify({ makeReactive })
