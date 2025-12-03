import globalify from '@sky-modules/core/globalify'

import * as imports from '../vike-handler'

declare global {
    const vikeHandler: typeof imports.vikeHandler
}

globalify({ ...imports })
