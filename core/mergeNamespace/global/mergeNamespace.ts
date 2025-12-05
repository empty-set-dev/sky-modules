import globalify from '@sky-modules/core/globalify'

import mergeNamespace, * as imports from '../mergeNamespace'

declare global {
    const mergeNamespace: typeof imports.default
    type mergeNamespace = typeof imports.default
}

globalify({ mergeNamespace })
