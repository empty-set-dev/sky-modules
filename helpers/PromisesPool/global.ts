import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ PromisesPool: lib.default })

declare global {
    interface PromisesPool extends lib.default {}
    const PromisesPool: typeof lib.default
}
