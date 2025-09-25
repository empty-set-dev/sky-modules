import globalify from 'sky/core/globalify'

import * as lib from '.'

declare global {
    const HoneycombGrid: typeof lib
}

globalify({ HoneycombGrid: lib })
