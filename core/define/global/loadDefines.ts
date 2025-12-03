import globalify from '@sky-modules/core/globalify'

import loadDefines, * as imports from '../loadDefines'

declare global {
    const loadDefines: typeof imports.default
    type loadDefines = typeof imports.default
}

globalify({ loadDefines })
