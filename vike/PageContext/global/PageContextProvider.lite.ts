import globalify from '@sky-modules/core/globalify'

import Layout, * as imports from '../PageContextProvider.lite'

declare global {
    const Layout: typeof imports.default
    type Layout = typeof imports.default
    type PageContextProviderProps = imports.PageContextProviderProps
}

globalify({ Layout })
