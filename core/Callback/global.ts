import globalify from '../globalify'

import * as lib from '.'

declare global {
    type Callback<A extends unknown[], R> = lib.default<A, R>
}

globalify(lib)
