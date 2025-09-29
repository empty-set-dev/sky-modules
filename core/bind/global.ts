import globalify from '@sky-modules/core/globalify'

import bind, * as lib from '.'

declare global {
    const bind: typeof lib.default
}

globalify({ bind, ...lib })
