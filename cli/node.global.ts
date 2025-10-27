import globalify from '@sky-modules/core/globalify'

import node, * as imports from './node'

declare global {
    const node: typeof imports.default
    type node = typeof imports.default
}

globalify({ node })
