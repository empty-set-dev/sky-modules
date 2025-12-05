import globalify from '@sky-modules/core/globalify'

import Layout, * as imports from '../Layout.lite'

declare global {
    const Layout: typeof imports.default
    type Layout = typeof imports.default
    type LayoutProps<T extends TagName = 'div'> = imports.LayoutProps<T>
}

globalify({ Layout })
