import globalify from '@sky-modules/core/globalify'

import * as imports from '../Layout.Engine'

declare global {
    const computeLayout: typeof imports.computeLayout
    type LayoutStyles = imports.LayoutStyles
    type LayoutBox = imports.LayoutBox
}

globalify({ ...imports })
