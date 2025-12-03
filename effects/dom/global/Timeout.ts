import globalify from '@sky-modules/core/globalify'

import Timeout, * as imports from '../Timeout'

declare global {
    const Timeout: typeof imports.default
    type Timeout = typeof imports.default
}

globalify({ Timeout })
