import globalify from '@sky-modules/core/globalify'

import auth, * as imports from '../auth'

declare global {
    const auth: typeof imports.default
    type auth = typeof imports.default
}

globalify({ auth })
