import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ PromisesPool: lib.default })

declare global {
    class PromisesPool extends lib.default {}
}
