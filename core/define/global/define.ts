import globalify from '@sky-modules/core/globalify'

import define, * as imports from '../define'

declare global {
    const define: typeof imports.default
    type define = typeof imports.default
}

globalify({ define })
