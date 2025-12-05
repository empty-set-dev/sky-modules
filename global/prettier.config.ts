import globalify from '@sky-modules/core/globalify'

import prettier_config, * as imports from '../prettier.config'

declare global {
    const prettier_config: typeof imports.default
    type prettier_config = typeof imports.default
}

globalify({ prettier_config })
