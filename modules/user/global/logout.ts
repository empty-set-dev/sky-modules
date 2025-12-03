import globalify from '@sky-modules/core/globalify'

import logout, * as imports from '../logout'

declare global {
    const logout: typeof imports.default
    type logout = typeof imports.default
}

globalify({ logout })
