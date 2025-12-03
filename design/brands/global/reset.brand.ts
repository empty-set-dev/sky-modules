import globalify from '@sky-modules/core/globalify'

import reset_brand, * as imports from '../reset.brand'

declare global {
    const reset_brand: typeof imports.default
    type reset_brand = typeof imports.default
}

globalify({ reset_brand })
