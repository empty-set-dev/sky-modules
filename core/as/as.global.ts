import globalify from '@sky-modules/core/globalify'
import as, * as imports from './as'

declare global {
    type as = typeof imports.default
    const as: typeof imports.default
}

globalify({ as, ...imports })
