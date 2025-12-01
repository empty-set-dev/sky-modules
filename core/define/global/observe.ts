import globalify from '@sky-modules/core/globalify'

import * as imports from '../observe'

declare global {
    const observe: typeof imports.observe
    const unobserve: typeof imports.unobserve
}

globalify({ ...imports })
