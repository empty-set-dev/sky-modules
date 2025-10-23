import globalify from '@sky-modules/core/globalify'

import Layout_Header_lite, * as imports from './Layout.Header.lite'

declare global {
    const Layout_Header_lite: typeof imports.default
    type Layout_Header_lite = typeof imports.default
    type LayoutHeaderProps = imports.LayoutHeaderProps
}

globalify({ Layout_Header_lite, ...imports })
