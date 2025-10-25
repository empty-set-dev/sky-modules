import globalify from '@sky-modules/core/globalify'

import Layout_Header, * as imports from './Layout.Header.lite'

declare global {
    const Layout_Header: typeof imports.default
    type Layout_Header = typeof imports.default
    type LayoutHeaderProps = imports.LayoutHeaderProps
}

globalify({ Layout_Header })
