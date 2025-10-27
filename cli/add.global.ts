import globalify from '@sky-modules/core/globalify'

import add, * as imports from './add'

declare global {
    const add: typeof imports.default
    type add = typeof imports.default
}

globalify({ add })
