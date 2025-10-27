import globalify from '@sky-modules/core/globalify'

import check, * as imports from './check'

declare global {
    const check: typeof imports.default
    type check = typeof imports.default
}

globalify({ check })
