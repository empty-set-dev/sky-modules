import globalify from '@sky-modules/core/globalify'

import SearchParamsContext, * as imports from './SearchParamsContext'

declare global {
    const SearchParamsContext: typeof imports.default
    type SearchParamsContext = typeof imports.default
    const SearchParamsContextProvider: typeof imports.SearchParamsContextProvider
}

globalify({ SearchParamsContext, ...imports })
