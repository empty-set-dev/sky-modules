import globalify from '@sky-modules/core/globalify'

import mixin, * as imports from './mixin'

declare global {
    const mixin: typeof imports.default
    type mixin = typeof imports.default
}

globalify({ mixin, ...imports })
