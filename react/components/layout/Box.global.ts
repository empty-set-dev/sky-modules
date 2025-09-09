import globalify from 'sky/standard/globalify'

import * as lib from './Box'

declare global {
    interface BoxProps extends lib.BoxProps {}
    const Box: typeof lib.default
}

globalify({ Box: lib.default, ...lib })
