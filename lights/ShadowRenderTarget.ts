import Three from 'sky/pkgs/three'
import Vector3 from 'sky/math/Vector3'

export interface ShadowRenderTargertOptions {
    width?: number
    height?: number
    position: Vector3
    targetPosition: Vector3
    scene: Three.Scene
}
export default class ShadowRenderTargert {
    camera: Three.OrthographicCamera
    renderTarget: Three.WebGLRenderTarget

    constructor(options: ShadowRenderTargertOptions) {
        const width = options.width ?? 512
        const height = options.height ?? 512
        const { scene } = options

        this.renderTarget = new Three.WebGLRenderTarget(width, height)
        this.renderTarget.depthBuffer = true
        this.renderTarget.texture = new Three.DepthTexture(width, height)

        this.camera = new Three.OrthographicCamera(-100, 100, 100, -100)
        this.camera.up.set(0, 0, 1)
        this.camera.position.copy(options.position)
        this.camera.lookAt(options.targetPosition)
        this.camera.updateProjectionMatrix()
        scene.add(this.camera)
    }
}
