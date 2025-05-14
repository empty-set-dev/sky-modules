import globalify from 'sky/utilities/globalify'

import * as module from '.'

declare global {
    const HoneycombGrid: typeof module
}

globalify({ HoneycombGrid: module })
