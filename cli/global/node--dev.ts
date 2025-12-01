import globalify from '@sky-modules/core/globalify'

import devNode, * as imports from '../node--dev'

declare global {
    const devNode: typeof imports.default
    type devNode = typeof imports.default
}

globalify({ devNode })
