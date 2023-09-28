import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Timer: module.default })

declare global {
    type Timer = module.default
    const Timer: typeof module.default
}
