import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ Console: lib.default })

declare global {
    const Console: typeof console
}
