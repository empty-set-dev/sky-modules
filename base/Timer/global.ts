import globalify from 'base/globalify'

import * as module from '.'

globalify({ globalify: module.default })

declare global {
    type Timer = module.default
    const Timer: typeof module.default
}
