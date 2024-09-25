import 'features/effect/global'

export * from './_three'
export default Three

@effect
export class InScene extends Effect {
    constructor(object: Three.Object3D, scene: Three.Scene, deps: EffectDeps) {
        super(deps)

        scene.add(object)

        this.destroy = (): void => {
            scene.remove(object)
        }
    }
}
