import globalify from '@sky-modules/core/globalify'

import init, * as imports from './init'

declare global {
    const init: typeof imports.default
    type init = typeof imports.default
}

globalify({ init })
