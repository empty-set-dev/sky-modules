import type App from '#/App'

export default class DirectionalLight extends Effect {
    light: Three.DirectionalLight

    constructor(deps: EffectDeps) {
        super(deps)

        const light = (this.light = new Three.DirectionalLight(0xffffff))
        light.position.x = 10
        light.position.y = -10
        light.position.z = 10
    }

    onAppContext(app: App): void {
        inScene(app.scene, this.light, this)
    }
}
