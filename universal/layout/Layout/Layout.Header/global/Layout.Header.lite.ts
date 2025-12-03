import globalify from '@sky-modules/core/globalify'

import LayoutHeader, * as imports from '../Layout.Header.lite'

declare global {
    const LayoutHeader: typeof imports.default
    type LayoutHeader = typeof imports.default
    type LayoutHeaderProps<T extends TagName = 'header'> = imports.LayoutHeaderProps<T>
}

globalify({ LayoutHeader })
