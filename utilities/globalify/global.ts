import globalify from './-globalify'

import * as module from '.'

globalify({ globalify: module.default })

declare global {
    type globalify = typeof globalify
    const globalify: typeof module.default
}
