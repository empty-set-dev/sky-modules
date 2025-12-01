import globalify from '@sky-modules/core/globalify'

import buildDesktop, * as imports from '../desktop--build'

declare global {
    const buildDesktop: typeof imports.default
    type buildDesktop = typeof imports.default
}

globalify({ buildDesktop })
