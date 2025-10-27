import globalify from '@sky-modules/core/globalify'

import startWeb, * as imports from './web--start'

declare global {
    const startWeb: typeof imports.default
    type startWeb = typeof imports.default
}

globalify({ startWeb })
