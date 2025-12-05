import globalify from '@sky-modules/core/globalify'

import PromisePool from '../PromisePool'

declare global {
    const PromisePool: typeof PromisePool
    type PromisePool = typeof PromisePool
}

globalify({ PromisePool })
