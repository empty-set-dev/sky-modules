import globalify from '@sky-modules/core/globalify'

import brand, * as imports from '../design-system'

declare global {
    const brand: typeof imports.default
    type brand = typeof imports.default
}

globalify({ brand })
