import globalify from '../globalify'

import * as lib from '.'

declare global {
    type Callback<A extends unknown[] = [], R = void> = lib.default<A, R>
}

globalify(lib)
