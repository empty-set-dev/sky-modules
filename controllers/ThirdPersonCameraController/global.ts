import globalify from 'helpers/globalify'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import * as module from './-ThirdPersonCameraController'

globalify({ ThirdPersonCameraController: module.default })

declare global {
    class ThirdPersonCameraController extends Effect {
        constructor(parent: Parent, options: { camera: PerspectiveCamera })
    }
}
