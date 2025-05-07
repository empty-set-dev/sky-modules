export interface DrawPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default interface DrawPanel extends Enability {}
@enability
export default class DrawPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(210, 10 + 34)
    color!: string
    camera!: Vector2

    constructor(deps: EffectDeps, parameters: DrawPanelParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)
        this.drawContext = parameters.drawContext

        let x = 0
        const blackBrush = new Brush()
        {
            const brush = blackBrush
            brush.effect = new Effect(this.effect, blackBrush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ffffff'
            x += 50
        }

        const grayBrush = new Brush()
        {
            const brush = grayBrush
            brush.effect = new Effect(this.effect, grayBrush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#999999'
            x += 50
        }

        const whiteBrush = new Brush()
        {
            const brush = whiteBrush
            brush.effect = new Effect(this.effect, whiteBrush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#000000'
            x += 50
        }

        const green1Brush = new Brush()
        {
            const brush = green1Brush
            brush.effect = new Effect(this.effect, green1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#55ff55'
            x += 50
        }

        const green2Brush = new Brush()
        {
            const brush = green2Brush
            brush.effect = new Effect(this.effect, green2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#99ff99'
            x += 50
        }

        const yellow1Brush = new Brush()
        {
            const brush = yellow1Brush
            brush.effect = new Effect(this.effect, yellow1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ffff55'
            x += 50
        }

        const yellow2Brush = new Brush()
        {
            const brush = yellow2Brush
            brush.effect = new Effect(this.effect, yellow2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ffff99'
            x += 50
        }

        const red1Brush = new Brush()
        {
            const brush = red1Brush
            brush.effect = new Effect(this.effect, red1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ff5555'
            x += 50
        }

        const red2Brush = new Brush()
        {
            const brush = red2Brush
            brush.effect = new Effect(this.effect, red2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ff9999'
            x += 50
        }

        const pink1Brush = new Brush()
        {
            const brush = pink1Brush
            brush.effect = new Effect(this.effect, pink1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ff55ff'
            x += 50
        }

        const pink2Brush = new Brush()
        {
            const brush = pink2Brush
            brush.effect = new Effect(this.effect, pink2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#ff99ff'
            x += 50
        }

        const blue1Brush = new Brush()
        {
            const brush = blue1Brush
            brush.effect = new Effect(this.effect, blue1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#5555ff'
            x += 50
        }

        const blue2Brush = new Brush()
        {
            const brush = blue2Brush
            brush.effect = new Effect(this.effect, blue2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#9999ff'
            x += 50
        }

        const cyan1Brush = new Brush()
        {
            const brush = cyan1Brush
            brush.effect = new Effect(this.effect, cyan1Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#55ffff'
            x += 50
        }

        const cyan2Brush = new Brush()
        {
            const brush = cyan2Brush
            brush.effect = new Effect(this.effect, cyan2Brush)
            brush.panel = this
            brush.drawContext = this.drawContext
            brush.position = new Vector2(210 + x, 10 + 34)
            brush.color = '#99ffff'
            x += 50
        }
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
        if (!ev.visible) {
            return
        }

        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: window.innerWidth - this.position.x,
            h: 40,
            radius: 16,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })

        next()
    }
}

class Brush {
    effect!: Effect
    position = new Vector2()
    drawContext!: CanvasRenderingContext2D
    color!: string
    panel!: DrawPanel

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (
            ev.x >= this.position.x &&
            ev.x <= this.position.x + 40 &&
            ev.y >= this.position.y &&
            ev.y <= this.position.y + 40
        ) {
            this.panel.color = this.color
        }
    }

    protected draw(): void {
        Canvas.drawRoundedRect(this.drawContext, {
            x: this.position.x,
            y: this.position.y,
            w: 40,
            h: 40,
            radius: 16,
            color: this.color,
            strokeColor: '#333333',
            strokeWidth: 1,
        })
    }
}
