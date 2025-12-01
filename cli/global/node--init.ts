import globalify from '@sky-modules/core/globalify'

import initNode, * as imports from '../node--init'

declare global {
    const initNode: typeof imports.default
    type initNode = typeof imports.default
}

globalify({ initNode })
