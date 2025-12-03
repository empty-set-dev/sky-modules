import globalify from '@sky-modules/core/globalify'

import eslint_config, * as imports from '../eslint.config'

declare global {
    const eslint_config: typeof imports.default
    type eslint_config = typeof imports.default
}

globalify({ eslint_config })
