import Vector3 from 'sky/math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import SmartPointerLock from '../SmartPointerLock'

export interface ThirdPersonCameraControllerParameters {
    camera: PerspectiveCamera
    getTarget: () => Vector3
    hasPointerLock?: boolean
    minAngle?: () => number
    maxAngle?: () => number
    distance: () => number
    z?: () => number
    onUpdate?: () => void
}
export default class ThirdPersonCameraController {
    readonly effect: Effect
    camera: PerspectiveCamera
    getTarget: () => Vector3
    readonly angles = [Math.PI / 2, 0]
    minAngle = (): number => -Math.PI / 2 + 0.001
    maxAngle = (): number => Math.PI / 2 - 0.001
    distance: () => number
    z: () => number

    constructor(deps: EffectDeps, parameters: ThirdPersonCameraControllerParameters) {
        this.effect = new Effect(deps)

        const { onUpdate } = parameters
        this.camera = parameters.camera
        this.getTarget = parameters.getTarget
        this.minAngle = parameters.minAngle ?? ((): number => -Math.PI / 2 + 0.001)
        this.maxAngle = parameters.maxAngle ?? ((): number => Math.PI / 2 - 0.001)
        this.distance = parameters.distance ?? ((): number => 10)
        this.z = parameters.z ?? ((): number => 0)
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
        onUpdate && onUpdate()

        if (parameters.hasPointerLock !== false) {
            this.__smartPointerLock = new SmartPointerLock(this.effect)
        }

        new WindowEventListener(
            'mousemove',
            ev => {
                if (this.__smartPointerLock && !this.__smartPointerLock.isLocked) {
                    return
                }

                this.angles[0] += ev.movementX * 0.01
                this.angles[1] += ev.movementY * 0.01
                this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
                onUpdate && onUpdate()
            },
            [this.effect]
        )
    }

    updateCamera(): void {
        const { camera, distance } = this
        const target = this.getTarget()

        camera.position.x =
            target.x + Math.cos(this.angles[0]) * Math.cos(this.angles[1]) * distance()
        camera.position.y =
            target.y - Math.sin(this.angles[0]) * Math.cos(this.angles[1]) * distance()
        camera.position.z = target.z + this.z() + Math.sin(this.angles[1]) * distance()
        camera.lookAt(new Vector3(target.x, target.y, target.z + this.z()))
    }

    protected afterAnimationFrame(): void {
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
    }

    __smartPointerLock?: SmartPointerLock
}
