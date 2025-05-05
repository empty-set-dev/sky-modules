export interface DrawPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default class DrawPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(210, 10 + 34)
    visible = true
    color!: string
    camera!: Vector2

    constructor(deps: EffectDeps, parameters: DrawPanelParameters) {
        this.effect = new Effect(deps, this)
        this.drawContext = parameters.drawContext

        const blackBrush = new Brush()
        blackBrush.effect = new Effect(this.effect, blackBrush)
        blackBrush.panel = this
        blackBrush.drawContext = this.drawContext
        blackBrush.position = new Vector2(210, 10 + 34)
        blackBrush.color = '#FFFFFF'

        const whiteBrush = new Brush()
        whiteBrush.effect = new Effect(this.effect, whiteBrush)
        whiteBrush.panel = this
        whiteBrush.drawContext = this.drawContext
        whiteBrush.position = new Vector2(210 + 50, 10 + 34)
        whiteBrush.color = '#000000'

        const grayBrush = new Brush()
        grayBrush.effect = new Effect(this.effect, grayBrush)
        grayBrush.panel = this
        grayBrush.drawContext = this.drawContext
        grayBrush.position = new Vector2(210 + 100, 10 + 34)
        grayBrush.color = '#999999'

        const pinkBrush = new Brush()
        pinkBrush.effect = new Effect(this.effect, pinkBrush)
        pinkBrush.panel = this
        pinkBrush.drawContext = this.drawContext
        pinkBrush.position = new Vector2(210 + 150, 10 + 34)
        pinkBrush.color = '#FF5599'
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
            w: window.innerWidth - 210,
            h: 40,
            radius: 16,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })

        next()
    }

    private __transformMouse(mouse: Sky.MouseEvent): void {
        mouse.x -= this.camera.x - window.innerWidth / 2
        mouse.y -= this.camera.y - window.innerHeight / 2
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
