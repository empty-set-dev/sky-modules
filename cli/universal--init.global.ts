import globalify from '@sky-modules/core/globalify'

import initUniversal, * as imports from './universal--init'

declare global {
    const initUniversal: typeof imports.default
    type initUniversal = typeof imports.default
}

globalify({ initUniversal })
