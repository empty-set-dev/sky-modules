import globalify from '@sky-modules/core/globalify'

import sky_brand_foundation, * as imports from '../sky.brand.foundation'

declare global {
    const sky_brand_foundation: typeof imports.default
    type sky_brand_foundation = typeof imports.default
}

globalify({ sky_brand_foundation })
