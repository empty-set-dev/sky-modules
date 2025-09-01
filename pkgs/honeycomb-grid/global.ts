import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    const HoneycombGrid: typeof lib
}

globalify({ HoneycombGrid: lib })
