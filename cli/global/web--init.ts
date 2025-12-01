import globalify from '@sky-modules/core/globalify'

import initWeb, * as imports from '../web--init'

declare global {
    const initWeb: typeof imports.default
    type initWeb = typeof imports.default
}

globalify({ initWeb })
