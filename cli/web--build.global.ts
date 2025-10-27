import globalify from '@sky-modules/core/globalify'

import buildWeb, * as imports from './web--build'

declare global {
    const buildWeb: typeof imports.default
    type buildWeb = typeof imports.default
}

globalify({ buildWeb })
