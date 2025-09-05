import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    const MODE: typeof lib.default
}

globalify({ MODE: lib, ...lib })
