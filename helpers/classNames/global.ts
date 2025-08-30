import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ cn: lib.default })

declare global {
    const cx: typeof lib.cx
    const cn: typeof lib.default
}
