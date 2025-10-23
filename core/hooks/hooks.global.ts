import globalify from '@sky-modules/core/globalify'

import * as imports from './hooks'

declare global {
    const hook: typeof imports.hook
    const withHooks: typeof imports.withHooks
    type Hook = typeof imports.Hook
    type AnyHook = typeof imports.AnyHook
    type HooksOwner = typeof imports.HooksOwner
}

globalify({ ...imports })
