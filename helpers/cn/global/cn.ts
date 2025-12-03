import globalify from '@sky-modules/core/globalify'

import cn, * as imports from '../cn'

declare global {
    const cn: typeof imports.default
    type cn = typeof imports.default
    const cx: typeof imports.cx
    type Cx = imports.Cx
}

globalify({ cn, ...imports })
