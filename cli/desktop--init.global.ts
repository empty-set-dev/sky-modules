import globalify from '@sky-modules/core/globalify'

import initDesktop, * as imports from './desktop--init'

declare global {
    const initDesktop: typeof imports.default
    type initDesktop = typeof imports.default
}

globalify({ initDesktop })
