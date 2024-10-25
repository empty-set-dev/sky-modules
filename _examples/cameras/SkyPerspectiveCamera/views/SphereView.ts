import type App from '#/App'

export default class SphereView extends Effect {
    view: Three.Mesh

    constructor(deps: EffectDeps) {
        super(deps)

        this.view = new Three.Mesh(
            new Three.SphereGeometry(1),
            new Three.MeshToonMaterial({
                color: '#FF0000',
            })
        )
    }

    onAppContext(app: App): void {
        inScene(app.scene, this.view, this)
    }
}
