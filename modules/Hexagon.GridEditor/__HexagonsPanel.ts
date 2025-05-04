export interface HexagonsPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default class HexagonsPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(0, 10 + 34)
    visible = true

    constructor(deps: EffectDeps, parameters: HexagonsPanelParameters) {
        this.effect = new Effect(deps, this)
        this.drawContext = parameters.drawContext
    }

    @action_hook
    protected draw(ev: Sky.DrawEvent, next: Function): void {
        if (!ev.visible) {
            return
        }

        if (!this.visible) {
            return
        }

        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: 200,
            h: window.innerHeight - 20 - 34,
            radius: 16,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })

        next()
    }
}
