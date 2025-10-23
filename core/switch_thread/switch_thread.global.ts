import globalify from '@sky-modules/core/globalify'
import switch_thread, * as imports from './switch_thread'

declare global {
    type switch_thread = typeof imports.default
    const switch_thread: typeof imports.default
}

globalify({ switch_thread, ...imports })
