import globalify from '@sky-modules/core/globalify'

import StoreContext, * as imports from './StoreContext'

declare global {
    const StoreContext: typeof imports.default
    type StoreContext = typeof imports.default
    const StoreProvider: typeof imports.StoreProvider
}

globalify({ StoreContext, ...imports })
