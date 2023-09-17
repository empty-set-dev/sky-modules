import globalify from 'base/globalify'

import * as module from '.'

globalify({ PromisesPool: module.default })

declare global {
    type PromisesPool = module.default
    const PromisesPool: typeof module.default
}
