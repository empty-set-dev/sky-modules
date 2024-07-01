import globalify from 'sky/helpers/globalify'
import * as module from 'three'
import { Scene, Object3D } from 'three'

declare global {
    class InScene extends Effect {
        constructor(object: Object3D, scene: Scene, deps: EffectDeps)
    }

    class Scene extends module.Scene {}
    class Object3D extends module.Object3D {}
    class PerspectiveCamera extends module.PerspectiveCamera {}
}

@effect
class InScene extends Effect {
    constructor(object: Object3D, scene: Scene, deps: EffectDeps) {
        super(deps)

        scene.add(object)
        this.destroy = (): void => {
            scene.remove(object)
        }
    }
}

globalify({ ...module, InScene })
