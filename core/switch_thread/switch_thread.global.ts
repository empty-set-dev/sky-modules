import globalify from '@sky-modules/core/globalify'

import switch_thread, * as imports from './switch_thread'

declare global {
    const switch_thread: typeof imports.default
}

globalify({ switch_thread, ...imports })
