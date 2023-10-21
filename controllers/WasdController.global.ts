import { Vector3 } from 'three/src/Three'
import globalify from 'utilities/globalify'

import * as module from './WasdController'

globalify({ WasdController: module.default })

declare global {
    class WasdController extends Effect {
        force: number

        constructor(link: Effects, target: Vector3, force: number)
    }
}
