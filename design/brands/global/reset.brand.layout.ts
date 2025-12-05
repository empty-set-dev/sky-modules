import globalify from '@sky-modules/core/globalify'

import reset_brand_layout, * as imports from '../reset.brand.layout'

declare global {
    const reset_brand_layout: typeof imports.default
    type reset_brand_layout = typeof imports.default
}

globalify({ reset_brand_layout })
