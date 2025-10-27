import globalify from '@sky-modules/core/globalify'

import initAll, * as imports from './init--all'

declare global {
    const initAll: typeof imports.default
    type initAll = typeof imports.default
}

globalify({ initAll })
