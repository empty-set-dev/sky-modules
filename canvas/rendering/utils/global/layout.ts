import globalify from '@sky-modules/core/globalify'

import * as imports from '../layout'

declare global {
    const calculateFlexLayout: typeof imports.calculateFlexLayout
    const calculateGridLayout: typeof imports.calculateGridLayout
    type LayoutPosition = imports.LayoutPosition
}

globalify({ ...imports })
