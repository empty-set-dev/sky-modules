import globalify from '@sky-modules/core/globalify'
import * as imports from './hooks'

declare global {
    const hook: typeof imports.hook
    const withHooks: typeof imports.withHooks
    const Hook: typeof imports.Hook
    const AnyHook: typeof imports.AnyHook
    const HooksOwner: typeof imports.HooksOwner
}

globalify({ ...imports })
