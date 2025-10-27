import globalify from '@sky-modules/core/globalify'

import create, * as imports from './create'

declare global {
    const create: typeof imports.default
    type create = typeof imports.default
}

globalify({ create })
