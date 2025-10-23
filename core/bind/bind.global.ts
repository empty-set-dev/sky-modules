import globalify from '@sky-modules/core/globalify'

import bind, * as imports from './bind'

declare global {
    const bind: typeof imports.default
    type bind = typeof imports.default
}

globalify({ bind, ...imports })
