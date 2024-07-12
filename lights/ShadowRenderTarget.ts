import Vector3 from 'sky/math/Vector3'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { WebGLRenderTarget } from 'three/src/renderers/WebGLRenderTarget'
import { Scene } from 'three/src/scenes/Scene'
import { DepthTexture } from 'three/src/textures/DepthTexture'

export interface ShadowRenderTargertOptions {
    width?: number
    height?: number
    position: Vector3
    targetPosition: Vector3
    scene: Scene
}
export default class ShadowRenderTargert {
    camera: OrthographicCamera
    renderTarget: WebGLRenderTarget

    /**
     * @param {ShadowRenderTargertOptions} options
     */
    constructor(options: ShadowRenderTargertOptions) {
        const width = options.width ?? 512
        const height = options.height ?? 512
        const { scene } = options

        this.renderTarget = new WebGLRenderTarget(width, height)
        this.renderTarget.depthBuffer = true
        this.renderTarget.texture = new DepthTexture(width, height)

        this.camera = new OrthographicCamera(-100, 100, 100, -100)
        this.camera.up.set(0, 0, 1)
        this.camera.position.copy(options.position)
        this.camera.lookAt(options.targetPosition)
        this.camera.updateProjectionMatrix()
        scene.add(this.camera)
    }
}
