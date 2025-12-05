import globalify from '@sky-modules/core/globalify'

import stylelint_config, * as imports from '../stylelint.config'

declare global {
    const stylelint_config: typeof imports.default
    type stylelint_config = typeof imports.default
}

globalify({ stylelint_config })
