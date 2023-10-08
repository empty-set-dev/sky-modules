import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Fc: module.default })

declare global {
    interface Fc {}
    const Fc: typeof module.default & Fc
}
