import globalify from '@sky-modules/core/globalify'

import runsOnSide, * as imports from './runsOnSide'

declare global {
    const runsOnSide: typeof imports.default
    const runsOnServerSide: typeof imports.runsOnServerSide
    const runsOnClientSide: typeof imports.runsOnClientSide
}

globalify({ runsOnSide, ...imports })
