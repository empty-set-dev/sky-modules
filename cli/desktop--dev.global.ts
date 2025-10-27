import globalify from '@sky-modules/core/globalify'

import devDesktop, * as imports from './desktop--dev'

declare global {
    const devDesktop: typeof imports.default
    type devDesktop = typeof imports.default
}

globalify({ devDesktop })
