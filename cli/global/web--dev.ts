import globalify from '@sky-modules/core/globalify'

import devWeb, * as imports from '../web--dev'

declare global {
    const devWeb: typeof imports.default
    type devWeb = typeof imports.default
}

globalify({ devWeb })
