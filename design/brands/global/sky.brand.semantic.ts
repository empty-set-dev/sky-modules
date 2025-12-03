import globalify from '@sky-modules/core/globalify'

import sky_brand_semantic, * as imports from '../sky.brand.semantic'

declare global {
    const sky_brand_semantic: typeof imports.default
    type sky_brand_semantic = typeof imports.default
}

globalify({ sky_brand_semantic })
