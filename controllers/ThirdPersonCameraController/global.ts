import globalify from 'sky/helpers/globalify'
import Vector3 from 'sky/math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import * as module from './-ThirdPersonCameraController'

globalify({ ThirdPersonCameraController: module.default })

declare global {
    interface ThirdPersonCameraControllerOptions {
        camera: PerspectiveCamera
        getTarget: () => Vector3
        distance?: number
        z?: number
        minAngle?: number
        maxAngle?: number
        onUpdate?: () => void
    }
    class ThirdPersonCameraController extends Effect {
        camera: PerspectiveCamera
        getTarget: () => Vector3
        readonly angles: [number, number]
        minAngle: number
        maxAngle: number
        distance: number
        z: number

        constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions)
    }
}
