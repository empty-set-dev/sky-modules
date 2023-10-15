import globalify from 'utilities/globalify'

import * as module from './WasdController'

globalify({ WasdController: module.default })

declare global {
    class WasdController extends Effect {}
}
