import Vector3 from 'math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

export interface ThirdPersonCameraControllerOptions {
    camera: PerspectiveCamera
    target: Vector3
    distance: number
    z?: number
    onUpdate?: () => void
}
@effect
export default class ThirdPersonCameraController extends Effect {
    camera: PerspectiveCamera
    target: Vector3
    angles = [0, 0]
    distance: number
    z: number

    constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions) {
        super(deps)

        const { camera, target, distance, z, onUpdate } = options
        this.camera = camera
        this.target = target
        this.distance = distance ?? 10
        this.z = z ?? 0

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
                this.angles[1] = Math.minmax(
                    this.angles[1],
                    -Math.PI / 2 + 0.001,
                    Math.PI / 2 - 0.001
                )
                onUpdate && onUpdate()
            },
            [this]
        )
    }

    onAnimationFrame(): void {
        const { camera, target, distance } = this
        camera.position.x =
            target.x + Math.cos(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.y =
            target.y - Math.sin(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.z = target.z + this.z + Math.sin(this.angles[1]) * distance
        camera.lookAt(new Vector3(target.x, target.y, target.z + this.z))
    }

    private __pointerLock: PointerLock
}
