import globalify from '/utilities/globalify'

import * as module from '.'

globalify({ classnames: module.default })

declare global {
    const classnames: typeof module.default
}
