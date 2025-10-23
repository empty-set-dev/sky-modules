import globalify from '@sky-modules/core/globalify'

import config, * as imports from './config'

declare global {
    const config: typeof imports.default
    type config = typeof imports.default
}

globalify({ config, ...imports })
