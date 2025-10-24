import globalify from '@sky-modules/core/globalify'

import PromisePool, * as imports from './PromisePool'

declare global {
    type PromisePool = imports.default
}

// No runtime values to globalize
