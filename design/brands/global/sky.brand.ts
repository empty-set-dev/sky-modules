import globalify from '@sky-modules/core/globalify'

import sky_brand, * as imports from '../sky.brand'

declare global {
    const sky_brand: typeof imports.default
    type sky_brand = typeof imports.default
}

globalify({ sky_brand })
