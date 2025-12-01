import globalify from '@sky-modules/core/globalify'

import universal, * as imports from '../universal'

declare global {
    const universal: typeof imports.default
    type universal = typeof imports.default
}

globalify({ universal })
