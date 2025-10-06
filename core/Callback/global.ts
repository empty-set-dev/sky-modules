import globalify from '../globalify'

import * as lib from '.'

declare global {
    type Callback<A extends unknown[], R, T> = lib.default<A, R, T>
}

globalify(lib)
