import globalify from '@sky-modules/core/globalify'

import worker, * as imports from '../worker'

declare global {
    const worker: typeof imports.default
    type worker = typeof imports.default
}

globalify({ worker })
