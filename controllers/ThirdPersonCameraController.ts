import Vector3 from 'sky/math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import SmartPointerLock from './SmartPointerLock'

export interface ThirdPersonCameraControllerOptions {
    camera: PerspectiveCamera
    getTarget: () => Vector3
    pointerLock?: boolean
    minAngle?: () => number
    maxAngle?: () => number
    distance: () => number
    z?: () => number
    onUpdate?: () => void
}
export default class ThirdPersonCameraController extends Effect {
    camera: PerspectiveCamera
    getTarget: () => Vector3
    readonly angles = [Math.PI / 2, 0]
    minAngle = (): number => -Math.PI / 2 + 0.001
    maxAngle = (): number => Math.PI / 2 - 0.001
    distance: () => number
    z: () => number

    constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions) {
        super(deps)

        const { onUpdate } = options
        this.camera = options.camera
        this.getTarget = options.getTarget
        this.minAngle = options.minAngle ?? ((): number => -Math.PI / 2 + 0.001)
        this.maxAngle = options.maxAngle ?? ((): number => Math.PI / 2 - 0.001)
        this.distance = options.distance ?? ((): number => 10)
        this.z = options.z ?? ((): number => 0)
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
        onUpdate && onUpdate()

        if (options.pointerLock !== false) {
            this.__smartPointerLock = new SmartPointerLock(this)
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
            [this]
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

    afterAnimationFrame(): void {
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
    }

    __smartPointerLock?: SmartPointerLock
}
