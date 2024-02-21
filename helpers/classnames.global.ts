import globalify from 'utilities/globalify'

import * as module from './classnames'

globalify({ classnames: module.default })

declare global {
    const classnames: typeof module.default
}
