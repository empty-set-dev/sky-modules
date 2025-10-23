import globalify from '@sky-modules/core/globalify'

import isIos, * as imports from './isIos'

declare global {
    const isIos: typeof imports.default
    type isIos = typeof imports.default
    const getIosVersion: typeof imports.getIosVersion
}

globalify({ isIos, ...imports })
