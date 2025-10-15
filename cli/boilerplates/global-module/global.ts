import globalify from '@sky-modules/core/globalify'

import $GLOBAL_MODULE, * as lib from '.'

declare global {
    const $GLOBAL_MODULE: typeof lib.default
}

globalify({ $GLOBAL_MODULE, ...lib })
