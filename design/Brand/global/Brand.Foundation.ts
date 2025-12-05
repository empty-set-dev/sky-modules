import globalify from '@sky-modules/core/globalify'

import Brand_Foundation, * as imports from '../Brand.Foundation'

declare global {
    const Brand_Foundation: typeof imports.default
    type Brand_Foundation = typeof imports.default
}

globalify({ Brand_Foundation })
