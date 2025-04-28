import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ PromisesPool: pkg.default })

declare global {
    class PromisesPool extends pkg.default {}
}
