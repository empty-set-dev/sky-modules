import globalify from './`globalify'

import * as module from '.'

globalify({ globalify: module.default })

declare global {
    type globalify = module.default
    const globalify: typeof module.default
}
