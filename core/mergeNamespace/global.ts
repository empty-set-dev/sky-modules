import globalify from '@sky-modules/core/globalify'

import mergeNamespace, * as lib from '.'

declare global {
    const mergeNamespace: typeof lib.default
}

globalify({ mergeNamespace, ...lib })
