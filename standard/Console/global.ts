import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ Console: lib.default })

declare global {
    const Console: typeof lib.default
}
