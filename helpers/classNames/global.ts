import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ cn: lib.default })

declare global {
    const cn: typeof lib.default
}
