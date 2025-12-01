import globalify from '@sky-modules/core/globalify'

import startNode, * as imports from '../node--start'

declare global {
    const startNode: typeof imports.default
    type startNode = typeof imports.default
}

globalify({ startNode })
