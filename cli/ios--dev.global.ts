import globalify from '@sky-modules/core/globalify'

import devIos, * as imports from './ios--dev'

declare global {
    const devIos: typeof imports.default
    type devIos = typeof imports.default
}

globalify({ devIos })
