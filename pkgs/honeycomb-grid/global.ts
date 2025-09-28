import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    const HoneycombGrid: typeof lib
}

globalify({ HoneycombGrid: lib })
