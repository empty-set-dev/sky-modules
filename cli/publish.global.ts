import globalify from '@sky-modules/core/globalify'

import publish, * as imports from './publish'

declare global {
    const publish: typeof imports.default
    type publish = typeof imports.default
}

globalify({ publish })
