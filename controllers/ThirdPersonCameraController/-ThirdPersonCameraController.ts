import Vector3 from 'math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

export interface ThirdPersonCameraControllerOptions {
    camera: PerspectiveCamera
    target: Vector3
    distance: number
    onUpdate?: () => void
}
@effect
export default class ThirdPersonCameraController extends Effect {
    camera: PerspectiveCamera
    target: Vector3
    angles = [0, 0]
    distance: number

    constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions) {
        super(deps)

        const { camera, target, distance, onUpdate } = options
        this.camera = camera
        this.target = target
        this.distance = distance ?? 10

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
        camera.position.x = target.x + Math.cos(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.y = target.y - Math.sin(this.angles[0]) * Math.cos(this.angles[1]) * distance
        camera.position.z = target.z + Math.sin(this.angles[1]) * distance
        camera.lookAt(target)
    }
}
