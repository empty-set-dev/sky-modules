import globalify from '@sky-modules/core/globalify'

import web, * as imports from '../web'

declare global {
    const web: typeof imports.default
    type web = typeof imports.default
}

globalify({ web })
