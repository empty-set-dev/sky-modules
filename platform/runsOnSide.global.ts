import globalify from 'sky/standard/globalify'

import runsOnSide, * as lib from './runsOnSide'

declare global {
    const runsOnSide: typeof lib.de
}

globalify({ runsOnSide, ...lib })
