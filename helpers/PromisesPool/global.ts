import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ PromisesPool: pkg.default })

declare global {
    interface PromisesPool extends pkg.default {}
    const PromisesPool: typeof pkg.default
}
