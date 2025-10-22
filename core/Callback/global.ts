import globalify from '../globalify'

import * as imports from '.'

declare global {
    type Callback<A extends unknown[] = [], R = void> = imports.default<A, R>
}

globalify(imports)
