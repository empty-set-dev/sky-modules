import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ PromisePool: lib.default })

declare global {
    interface PromiseConstructor {
        Pool: typeof lib.default
    }
}
