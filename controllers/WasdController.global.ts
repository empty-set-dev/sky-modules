import globalify from 'utilities/globalify'

import * as module from './WasdController'
import { Vector3 } from 'three'

globalify({ WasdController: module.default })

declare global {
    class WasdController extends Effect {
        constructor(link: Effects, target: Vector3)
    }
}
