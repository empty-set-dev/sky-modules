import globalify from 'sky/standard/globalify'

import * as lib from './Box'

declare global {
    const Box: typeof lib.default
}

globalify({ Box: lib.default, ...lib })
