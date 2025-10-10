import EffectDep from '@sky-modules/features/effect/EffectDep'
import Object2D from './Object2D'

export default class Scene extends Object2D {
    static context = true

    background?: string | CanvasGradient | CanvasPattern

    constructor(dep: EffectDep) {
        super(dep)
    }

    setBackground(background: string | CanvasGradient | CanvasPattern): this {
        this.background = background
        return this
    }

    clone(): Scene {
        const cloned = new Scene(this.dep)
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        cloned.background = this.background
        return cloned
    }
}