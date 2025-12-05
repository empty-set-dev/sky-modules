import globalify from '@sky-modules/core/globalify'

import reset_brand_foundation, * as imports from '../reset.brand.foundation'

declare global {
    const reset_brand_foundation: typeof imports.default
    type reset_brand_foundation = typeof imports.default
}

globalify({ reset_brand_foundation })
