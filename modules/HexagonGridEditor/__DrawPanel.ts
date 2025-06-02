export interface __DrawPanelParameters {
    brushes: {
        row1: __DrawPanelBrushParameters[]
        row2: __DrawPanelBrushParameters[]
    }
}
export interface __DrawPanelBrushParameters {
    color: string
    type: Brush['type']
}
export default interface __DrawPanel extends Enability {}
@enability
export default class __DrawPanel extends Canvas.Sprite {
    brush!: Brush
    w!: number
    h!: number

    constructor(deps: EffectDeps, parameters: __DrawPanelParameters) {
        super(deps)
        Enability.super(this)

        this.position = new Vector2(210, 44)

        this.__createBrushes(parameters.brushes)
    }

    protected update(): void {
        this.w = window.innerWidth - this.position.x
        this.h = 78
    }

    protected draw(ev: Sky.DrawEvent): void {
        const canvas = this.effect.context(Canvas)

        Canvas.drawRoundedRect(canvas.drawContext, {
            x: ev.x,
            y: ev.y,
            w: this.w,
            h: this.h,
            radius: 8,
            color: '#121212',
            strokeColor: '#333333',
            strokeWidth: 1,
        })
    }

    private __createBrushes(brushes: __DrawPanelParameters['brushes']): this {
        let x = 0
        brushes.row1.forEach(brushParameters => {
            new Brush(this.effect, {
                panel: this,
                position: new Vector2(x + 6, 6),
                color: brushParameters.color,
                type: brushParameters.type,
            })
            x += 36
        })

        x = 0
        brushes.row2.forEach(brushParameters => {
            new Brush(this.effect, {
                panel: this,
                position: new Vector2(x + 6, 42),
                color: brushParameters.color,
                type: brushParameters.type,
            })
            x += 36
        })

        return this
    }
}

interface BrushParameters {
    position: Vector2
    color: string
    panel: __DrawPanel
    type: Brush['type']
}
class Brush extends Canvas.Sprite {
    position = new Vector2()
    color!: string
    panel!: __DrawPanel
    type: 'color' | 'border' | 'border2' | 'center'

    constructor(deps: EffectDeps, parameters: BrushParameters) {
        super(deps)
        this.position = parameters.position
        this.color = parameters.color
        this.panel = parameters.panel
        this.type = parameters.type
    }

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (ev.isCaptured) {
            return
        }

        if (ev.x >= 0 && ev.x <= 30 && ev.y >= 0 && ev.y <= 30) {
            this.panel.brush = this
        }
    }

    protected draw(ev: Sky.DrawEvent): void {
        const canvas = this.effect.context(Canvas)

        switch (this.type) {
            case 'color': {
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: this.color,
                    strokeColor: '#666666',
                    strokeWidth: 2,
                })
                break
            }
            case 'border': {
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: '#666666',
                    strokeWidth: 2,
                })
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x + 3,
                    y: ev.y + 3,
                    w: 24,
                    h: 24,
                    radius: 10,
                    strokeColor: this.color,
                    strokeWidth: 4,
                })
                break
            }
            case 'border2': {
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: '#666666',
                    strokeWidth: 2,
                })
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x + 6,
                    y: ev.y + 6,
                    w: 18,
                    h: 18,
                    radius: 8,
                    strokeColor: this.color,
                    strokeWidth: 4,
                })
                break
            }
            case 'center': {
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: '#666666',
                    strokeWidth: 2,
                })
                Canvas.drawRoundedRect(canvas.drawContext, {
                    x: ev.x + 10,
                    y: ev.y + 10,
                    w: 10,
                    h: 10,
                    radius: 4,
                    color: this.color,
                })
                break
            }
        }
    }
}
