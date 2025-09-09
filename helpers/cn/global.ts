import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    type Cx = lib.Cx
    const cx: typeof lib.cx
    const cn: typeof lib.default
}

globalify({ cx: lib.cx, cn: lib.default })
