import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify(lib)

declare global {
    const Console: typeof console
}
