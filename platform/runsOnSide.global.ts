import globalify from 'sky/standard/globalify'

import runsOnSide, * as lib from './runsOnSide'

declare global {
    const runsOnSide: typeof lib.default
    const runsOnServerSide: typeof lib.runsOnServerSide
    const runsOnClientSide: typeof lib.runsOnClientSide
}

globalify({ runsOnSide, ...lib })
