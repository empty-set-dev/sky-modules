import globalify from '@sky-modules/core/globalify'

import Loop, * as imports from '../Loop'

declare global {
    const Loop: typeof imports.default
    type Loop = typeof imports.default
}

globalify({ Loop })
