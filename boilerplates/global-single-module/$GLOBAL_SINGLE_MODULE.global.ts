import globalify from 'sky/standard/globalify'

import $GLOBAL_SINGLE_MODULE, * as lib from './$GLOBAL_SINGLE_MODULE'

declare global {
    const $GLOBAL_SINGLE_MODULE: typeof lib.default
}

globalify({ $GLOBAL_SINGLE_MODULE, ...lib })
