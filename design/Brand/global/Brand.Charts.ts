import globalify from '@sky-modules/core/globalify'

import Brand_Charts, * as imports from '../Brand.Charts'

declare global {
    const Brand_Charts: typeof imports.default
    type Brand_Charts = typeof imports.default
}

globalify({ Brand_Charts })
