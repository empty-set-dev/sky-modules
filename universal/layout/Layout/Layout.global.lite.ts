import globalify from '@sky-modules/core/globalify'

import Layout_lite, * as imports from './Layout.lite'

declare global {
    const Layout_lite: typeof imports.default
    type Layout_lite = typeof imports.default
    type LayoutProps = imports.LayoutProps
}

globalify({ Layout_lite, ...imports })
