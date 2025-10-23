import globalify from '@sky-modules/core/globalify'

import canClone, * as imports from './canClone'

declare global {
    const canClone: typeof imports.default
    type canClone = typeof imports.default
}

globalify({ canClone, ...imports })
