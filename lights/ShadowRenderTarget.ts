import Vector3 from 'sky/math/Vector3'
import Three from 'sky/pkgs/three'

export interface ShadowRenderTargertParameters {
    width?: number
    height?: number
    position: Vector3
    targetPosition: Vector3
    scene: Three.Scene
}
export default class ShadowRenderTargert {
    camera: Three.OrthographicCamera
    renderTarget: Three.WebGLRenderTarget

    constructor(parameters: ShadowRenderTargertParameters) {
        const width = parameters.width ?? 512
        const height = parameters.height ?? 512
        const { scene } = parameters

        this.renderTarget = new Three.WebGLRenderTarget(width, height)
        this.renderTarget.depthBuffer = true
        this.renderTarget.texture = new Three.DepthTexture(width, height)

        this.camera = new Three.OrthographicCamera(-100, 100, 100, -100)
        this.camera.up.set(0, 0, 1)
        this.camera.position.copy(parameters.position)
        this.camera.lookAt(parameters.targetPosition)
        this.camera.updateProjectionMatrix()
        scene.add(this.camera)
    }
}
