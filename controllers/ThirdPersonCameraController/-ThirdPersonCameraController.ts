import Vector3 from 'math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

export interface ThirdPersonCameraControllerOptions {
    camera: PerspectiveCamera
    getTarget: () => Vector3
    distance: number
    z?: number
    minAngle?: number
    maxAngle?: number
    onUpdate?: () => void
}
@effect
export default class ThirdPersonCameraController extends Effect {
    camera: PerspectiveCamera
    getTarget: () => Vector3
    readonly angles = [0, 0]
    minAngle = -Math.PI / 2 + 0.001
    maxAngle = Math.PI / 2 - 0.001
    distance: number
    z: number

    constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions) {
        super(deps)

        const { onUpdate } = options
        this.camera = options.camera
        this.getTarget = options.getTarget
        this.minAngle = options.minAngle ?? -Math.PI / 2 + 0.001
        this.maxAngle = options.maxAngle ?? Math.PI / 2 - 0.001
        this.distance = options.distance ?? 10
        this.z = options.z ?? 0

        new WindowEventListener(
            'mousedown',
            () => {
                if (this.__pointerLock) {
                    return
                }

                this.__pointerLock = new PointerLock(this)
                new DocumentEventListener(
                    'pointerlockchange',
                    () => {
                        new DocumentEventListener(
                            'pointerlockchange',
                            () => {
                                new Timeout(
                                    () => {
                                        this.__pointerLock.destroy()
                                        delete this.__pointerLock
                                    },
                                    2000,
                                    [this, this.__pointerLock]
                                )
                            },
                            [this, this.__pointerLock],
                            { once: true }
                        )
                    },
                    [this, this.__pointerLock],
                    { once: true }
                )
            },
            [this]
        )

        new WindowEventListener(
            'mousemove',
            ev => {
                this.angles[0] += ev.movementX * 0.01
                this.angles[1] += ev.movementY * 0.01
                this.angles[1] = Math.minmax(this.angles[1], this.minAngle, this.maxAngle)
                onUpdate && onUpdate()
            },
            [this]
        )
    }

    afterAnimationFrame(): void {
        const { camera, distance } = this
        const target = this.getTarget()

        camera.position.x =
            target.x + Math.cos(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.y =
            target.y - Math.sin(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.z = target.z + this.z + Math.sin(this.angles[1]) * distance
        camera.lookAt(new Vector3(target.x, target.y, target.z + this.z))
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle, this.maxAngle)
    }

    private __pointerLock: PointerLock
}
