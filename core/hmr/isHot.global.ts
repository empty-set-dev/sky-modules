import globalify from '@sky-modules/core/globalify'

import isHot, * as imports from './isHot'

declare global {
    const isHot: typeof imports.default
}

globalify({ isHot })
