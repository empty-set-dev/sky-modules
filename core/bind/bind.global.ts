import globalify from '@sky-modules/core/globalify'
import bind, * as imports from './bind'

declare global {
    type bind = typeof imports.default
    const bind: typeof imports.default
}

globalify({ bind, ...imports })
