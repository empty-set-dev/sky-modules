export interface DrawPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default class DrawPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(210, 10 + 34)
    visibility: Canvas.Visibility = 'visible'

    constructor(deps: EffectDeps, parameters: DrawPanelParameters) {
        this.effect = new Effect(deps, this)
        this.drawContext = parameters.drawContext
    }

    draw(): void {
        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: window.innerWidth - 210,
            h: 40,
            radius: 16,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })
    }
}
