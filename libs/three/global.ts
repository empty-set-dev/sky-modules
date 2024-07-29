import globalify from 'sky/helpers/globalify'
import * as lib from 'three'
import { Scene, Object3D } from 'three'

declare global {
    class InScene extends Effect {
        constructor(object: Object3D, scene: Scene, deps: EffectDeps)
    }
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

globalify({ Three: lib, InScene })
