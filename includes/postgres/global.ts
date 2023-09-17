import globalify from 'base/globalify'

import * as module from '.'

globalify({ postgres: module.default })

declare global {
    const postgres: typeof module.default
}
