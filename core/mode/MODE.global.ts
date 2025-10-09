import globalify from '@sky-modules/core/globalify'

import * as lib from './MODE'

declare global {
    const MODE: typeof lib.default
}

globalify({ MODE: lib.default, ...lib })
