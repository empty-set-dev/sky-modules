import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({ PromisesPool: local.default })

declare global {
    type PromisesPool = local.default
    const PromisesPool: typeof local.default
}
