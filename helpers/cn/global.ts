import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ cx: lib.cx, cn: lib.default })

declare global {
    const cx: typeof lib.cx
    const cn: typeof lib.default
}
