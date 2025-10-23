import globalify from '@sky-modules/core/globalify'
import Callback, * as imports from './Callback'

declare global {
    type Callback = typeof imports.default
    const Callback: typeof imports.default
    const invokeCallback: typeof imports.invokeCallback
}

globalify({ Callback, ...imports })
