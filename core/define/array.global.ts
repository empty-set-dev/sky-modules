import globalify from '@sky-modules/core/globalify'

import array, * as imports from './array'

declare global {
    const array: typeof imports.default
    type array = typeof imports.default
}

globalify({ array })
