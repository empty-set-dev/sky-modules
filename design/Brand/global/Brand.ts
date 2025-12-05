import globalify from '@sky-modules/core/globalify'

import Brand, * as imports from '../Brand'

declare global {
    const Brand: typeof imports.default
    type Brand = typeof imports.default
    type BrandDescription = imports.BrandDescription
}

globalify({ Brand })
