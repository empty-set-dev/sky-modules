import globalify from '@sky-modules/core/globalify'

import checkAuth, * as imports from '../checkAuth'

declare global {
    const checkAuth: typeof imports.default
    type checkAuth = typeof imports.default
}

globalify({ checkAuth })
