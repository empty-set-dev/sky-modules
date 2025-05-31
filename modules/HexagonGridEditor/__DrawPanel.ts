export interface __DrawPanelParameters {
    drawContext: CanvasRenderingContext2D
    brushes: __DrawPanelBrushParameters[]
}
export interface __DrawPanelBrushParameters {
    color: string
}
export default interface __DrawPanel extends Enability {}
@enability
export default class __DrawPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(210, 10 + 34)
    color!: string
    camera!: Vector2

    constructor(deps: EffectDeps, parameters: __DrawPanelParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)

        this.drawContext = parameters.drawContext
        this.__createBrushes(parameters.brushes)
    }

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (
            ev.x >= this.position.x &&
            ev.x <= window.innerWidth &&
            ev.y >= this.position.y &&
            ev.y <= this.position.y + 40
        ) {
            ev.isCaptured = true
        }
    }

    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
        if (
            ev.x >= this.position.x &&
            ev.x <= window.innerWidth &&
            ev.y >= this.position.y &&
            ev.y <= this.position.y + 40
        ) {
            ev.isCaptured = true
        }
    }

    protected onGlobalMouseUp(ev: Sky.MouseUpEvent): void {
        if (
            ev.x >= this.position.x &&
            ev.x <= window.innerWidth &&
            ev.y >= this.position.y &&
            ev.y <= this.position.y + 40
        ) {
            ev.isCaptured = true
        }
    }

    @action_hook
    protected draw(ev: Sky.DrawEvent, next: Function): void {
        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: window.innerWidth - this.position.x,
            h: 80,
            radius: 16,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })

        next()
    }

    private __createBrushes(brushes: __DrawPanelBrushParameters[]): this {
        let x = 0

        brushes.forEach(brushParameters => {
            const brush = new Brush()
            brush.effect = new Effect(this.effect, brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(216 + x, 16 + 34)
            brush.color = brushParameters.color
            x += 36
        })

        return this
    }
}

class Brush {
    effect!: Effect
    position = new Vector2()
    drawContext!: CanvasRenderingContext2D
    color!: string
    panel!: __DrawPanel

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (
            ev.x >= this.position.x &&
            ev.x <= this.position.x + 30 &&
            ev.y >= this.position.y &&
            ev.y <= this.position.y + 30
        ) {
            this.panel.color = this.color
        }
    }

    protected draw(): void {
        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: 30,
            h: 30,
            radius: 8,
            color: this.color,
            strokeColor: '#666666',
            strokeWidth: 2,
        })
    }
}
