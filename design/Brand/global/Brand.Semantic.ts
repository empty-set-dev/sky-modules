import globalify from '@sky-modules/core/globalify'

import Brand_Semantic, * as imports from '../Brand.Semantic'

declare global {
    const Brand_Semantic: typeof imports.default
    type Brand_Semantic = typeof imports.default
}

globalify({ Brand_Semantic })
