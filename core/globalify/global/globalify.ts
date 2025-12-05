import globalify from '@sky-modules/core/globalify'

import _globalify, * as imports from '../globalify'

declare global {
    const globalify: typeof imports.default
    type globalify = typeof imports.default
}

globalify({ globalify: _globalify })
