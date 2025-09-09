import globalify from 'sky/standard/globalify'

import * as lib from './runsOnSide'

declare global {
    const runsOnSide: typeof lib.runsOnSide
    const runsOnServerSide: typeof lib.runsOnServerSide
    const runsOnClientSide: typeof lib.runsOnClientSide
}

globalify({ ...lib })
