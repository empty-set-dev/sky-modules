import globalify from '@sky-modules/core/globalify'

import PageContextProvider, * as imports from './PageContextProvider.lite'

declare global {
    const PageContextProvider: typeof imports.default
    type PageContextProvider = typeof imports.default
    type PageContextProviderProps = imports.PageContextProviderProps
}

globalify({ PageContextProvider, ...imports })
