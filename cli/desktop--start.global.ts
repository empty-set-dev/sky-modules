import globalify from '@sky-modules/core/globalify'

import startDesktop, * as imports from './desktop--start'

declare global {
    const startDesktop: typeof imports.default
    type startDesktop = typeof imports.default
}

globalify({ startDesktop })
