import globalify from 'sky/helpers/globalify'
import * as lib from 'three'
import { Scene, Object3D } from 'three'

declare global {
    class InScene extends Effect {
        constructor(object: Object3D, scene: Scene, deps: EffectDeps)
    }

    class Scene extends lib.Scene {}
    class Object3D extends lib.Object3D {}
    class PerspectiveCamera extends lib.PerspectiveCamera {}
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

globalify({ ...lib, InScene })
