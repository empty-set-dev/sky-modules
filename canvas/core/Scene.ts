import Object2D from './Object2D'

export default class Scene extends Object2D {
    static context = true

    background?: string | CanvasGradient | CanvasPattern

    setBackground(background: string | CanvasGradient | CanvasPattern): this {
        this.background = background
        return this
    }

    clone(): Scene {
        const cloned = new Scene()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        if (this.background) cloned.background = this.background
        return cloned
    }
}
