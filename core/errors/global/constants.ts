import globalify from '@sky-modules/core/globalify'

import * as imports from '../constants'

declare global {
    const DANGEROUS_KEYS: typeof imports.DANGEROUS_KEYS
}

globalify({ ...imports })
