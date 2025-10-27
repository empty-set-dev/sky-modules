import globalify from '@sky-modules/core/globalify'

import * as imports from './hooks'

declare global {
    const hook: typeof imports.hook
    type hook = typeof imports.hook
    const withHooks: typeof imports.withHooks
    type withHooks = typeof imports.withHooks
    type Hook = imports.Hook
    type AnyHook = imports.AnyHook
    type HooksOwner = imports.HooksOwner
}

globalify({ ...imports })
