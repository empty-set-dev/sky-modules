import globalify from '@sky-modules/core/globalify'

import Brand_Layout, * as imports from '../Brand.Layout'

declare global {
    const Brand_Layout: typeof imports.default
    type Brand_Layout = typeof imports.default
}

globalify({ Brand_Layout })
