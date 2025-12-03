import globalify from '@sky-modules/core/globalify'

import reset_brand_semantic, * as imports from '../reset.brand.semantic'

declare global {
    const reset_brand_semantic: typeof imports.default
    type reset_brand_semantic = typeof imports.default
}

globalify({ reset_brand_semantic })
