import Select from 'sky/components/UI/Select'

export interface __DrawPanelParameters {
    brushes: {
        color: __DrawPanelBrushParameters[]
        border: __DrawPanelBrushParameters[]
        border2: __DrawPanelBrushParameters[]
        center: __DrawPanelBrushParameters[]
        circle: __DrawPanelBrushParameters[]
        position: __DrawPanelBrushParameters[]
        icon: __DrawPanelBrushParameters[]
    }
}
export interface __DrawPanelBrushParameters {
    color?: string
    icon?: string
    position?: number
    default?: boolean
}
export default interface __DrawPanel extends Enability {}
@enability
export default class __DrawPanel extends Canvas.Sprite {
    brush!: Brush
    w!: number
    h!: number
    brushes!: __DrawPanelParameters['brushes']

    constructor(deps: EffectDeps, parameters: __DrawPanelParameters) {
        super(deps)
        Enability.super(this)

        this.position = new Vector2(210, 44)

        this.brushes = parameters.brushes
    }

    protected update(): void {
        this.w = window.innerWidth - this.position.x
        this.h = 78
    }

    protected draw(ev: Sky.DrawEvent): void {
        const canvas = this.effect.context(Canvas)

        canvas.drawRoundedRect({
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

    @bind
    getComponent(): ReactNode {
        return <__DrawPanelComponent self={this} />
    }
}

interface __DrawPanelComponentProps {
    self: __DrawPanel
}
function __DrawPanelComponent({ self }: __DrawPanelComponentProps): ReactNode {
    const b = 'DrawPanel'

    return (
        <div className="DrawPanel">
            <Select options={[]} label="Test" />
        </div>
    )
}

interface BrushParameters {
    position: Vector2
    color?: string
    drawPanel: __DrawPanel
    type: Brush['type']
    default?: boolean
}
class Brush extends Canvas.Sprite {
    position = new Vector2()
    color?: string
    icon?: string
    drawPanel!: __DrawPanel
    type: 'color' | 'border' | 'border2' | 'center' | 'center'

    constructor(deps: EffectDeps, parameters: BrushParameters) {
        super(deps)
        this.position = parameters.position
        this.color = parameters.color
        this.drawPanel = parameters.drawPanel
        this.type = parameters.type

        if (parameters.default) {
            this.drawPanel.brush = this
        }
    }

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (ev.isCaptured) {
            return
        }

        if (ev.x >= 0 && ev.x <= 30 && ev.y >= 0 && ev.y <= 30) {
            this.drawPanel.brush = this
        }
    }

    protected draw(ev: Sky.DrawEvent): void {
        const canvas = this.effect.context(Canvas)

        switch (this.type) {
            case 'color': {
                canvas.drawRoundedRect({
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: this.color ?? '#121212',
                    strokeColor: this.color ? '#666666' : '#ff5555',
                    strokeWidth: 2,
                })
                break
            }
            case 'border': {
                canvas.drawRoundedRect({
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: this.color ? '#666666' : '#ff5555',
                    strokeWidth: 2,
                })
                canvas.drawRoundedRect({
                    x: ev.x + 3,
                    y: ev.y + 3,
                    w: 24,
                    h: 24,
                    radius: 10,
                    strokeColor: this.color ?? '#121212',
                    strokeWidth: 4,
                })
                break
            }
            case 'border2': {
                canvas.drawRoundedRect({
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: this.color ? '#666666' : '#ff5555',
                    strokeWidth: 2,
                })
                canvas.drawRoundedRect({
                    x: ev.x + 6,
                    y: ev.y + 6,
                    w: 18,
                    h: 18,
                    radius: 8,
                    strokeColor: this.color ?? '#121212',
                    strokeWidth: 4,
                })
                break
            }
            case 'center': {
                canvas.drawRoundedRect({
                    x: ev.x,
                    y: ev.y,
                    w: 30,
                    h: 30,
                    radius: 12,
                    color: '#121212',
                    strokeColor: this.color ? '#666666' : '#ff5555',
                    strokeWidth: 2,
                })
                canvas.drawRoundedRect({
                    x: ev.x + 10,
                    y: ev.y + 10,
                    w: 10,
                    h: 10,
                    radius: 4,
                    color: this.color ?? '#121212',
                })
                break
            }
        }

        if (this.drawPanel.brush === this) {
            canvas.drawRoundedRect({
                x: ev.x,
                y: ev.y,
                w: 30,
                h: 30,
                radius: 12,
                strokeColor: '#ffffff',
                strokeWidth: 1,
            })
        }
    }
}
