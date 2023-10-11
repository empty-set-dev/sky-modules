import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Three: module.default })

declare global {
    type Three = typeof module.default
    const Three: typeof module.default
}
