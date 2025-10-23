import globalify from '@sky-modules/core/globalify'

import Layout_Root_lite, * as imports from './Layout.Root.lite'

declare global {
    const Layout_Root_lite: typeof imports.default
    type Layout_Root_lite = typeof imports.default
    type LayoutRootProps = imports.LayoutRootProps
}

globalify({ Layout_Root_lite, ...imports })
