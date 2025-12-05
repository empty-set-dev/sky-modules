import globalify from '@sky-modules/core/globalify'

import getStore, * as imports from '../getStore'

declare global {
    const getStore: typeof imports.default
    type getStore = typeof imports.default
}

globalify({ getStore })
