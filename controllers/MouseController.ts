import Vector2 from 'sky/math/Vector2'
import Vector3 from 'sky/math/Vector3'
import SkyRenderer from 'sky/renderers/SkyRenderer'
import { Camera } from 'three/src/cameras/Camera'

export interface MouseControllerOptions {
    onUpdate?: () => void
}
export default class MouseController extends Effect {
    mouse = new Vector2()
    onUpdate?: () => void

    constructor(deps: EffectDeps, options?: MouseControllerOptions) {
        super(deps)

        if (options) {
            const { onUpdate } = options

            this.onUpdate = onUpdate
        }
    }

    onSkyRendererContext(): void {
        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse = new Vector2(ev.clientX, ev.clientY)
                this.__updateMouse()
            },
            [this]
        )
        new WindowEventListener(
            'resize',
            () => {
                this.__updateMouse()
            },
            [this]
        )
    }

    cameraProjectionXY(options: { camera: Camera; z: number }): Vector2 {
        const { camera, z } = options
        const vec = new Vector3(this.mouse.x, this.mouse.y, z)
        vec.unproject(camera)
        vec.sub(camera.position).normalize()
        const distance = -camera.position.z / vec.z
        const position = new Vector3().copy(camera.position).add(vec.multiplyScalar(distance))
        return new Vector2().copy(position)
    }

    __updateMouse(): void {
        const renderer = this.context(SkyRenderer)
        const [w, h] = renderer.size()
        this.mouse.set((this.__mouse.x / w) * 2 - 1, -(this.__mouse.y / h) * 2 + 1)
        this.onUpdate && this.onUpdate()
    }

    private __mouse: Vector2
}
