import globalify from 'utilities/globalify/-globalify'

import * as module from './classnames'

globalify({ classnames: module.default })

declare global {
    const classnames: typeof module.default
}
