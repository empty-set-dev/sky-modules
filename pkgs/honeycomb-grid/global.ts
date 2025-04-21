import globalify from 'sky/utilities/globalify'

import * as lib from '.'

declare global {
    const HoneycombGrid: typeof lib
}

globalify({ HoneycombGrid: lib })
