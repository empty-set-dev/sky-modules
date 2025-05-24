import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ PromisesPool: module.default })

declare global {
    class PromisesPool extends module.default {}
}
