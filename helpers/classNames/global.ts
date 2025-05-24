import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ cn: module.default })

declare global {
    const cn: typeof module.default
}
