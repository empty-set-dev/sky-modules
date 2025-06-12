import Dropdown from 'sky/components/UI/Dropdown'

import styles from './__DrawPanel.module.scss'

export interface __DrawPanelParameters {
    brushes: {
        color?: __DrawPanelBrushParameters[]
        border?: __DrawPanelBrushParameters[]
        border2?: __DrawPanelBrushParameters[]
        circlePosition?: __DrawPanelBrushParameters[]
        rectPosition?: __DrawPanelBrushParameters[]
        icon?: __DrawPanelBrushParameters[]
    }
}
export interface __DrawPanelBrushParameters {
    color?: string
    value?: string
    uiIcon?: string
    icon?: string
    position?: number
    default?: boolean
}
export interface __DrawPanelBrush {
    brush: {
        color?: string
        value?: string
        icon?: string
        position?: number
        default?: boolean
    }
    type: 'color' | 'border' | 'border2' | 'circlePosition' | 'rectPosition' | 'icon'
}
export default interface __DrawPanel extends Enability {}
@enability
export default class __DrawPanel extends Canvas.Sprite {
    w!: number
    h!: number
    brushes!: __DrawPanelParameters['brushes']
    brush!: __DrawPanelBrush

    constructor(deps: EffectDeps, parameters: __DrawPanelParameters) {
        super(deps)
        Enability.super(this)

        this.position = new Vector2(210, 44)

        this.brushes = parameters.brushes
    }

    @bind
    getComponent(editor: HexagonGridEditor): ReactNode {
        return <DrawPanelComponent self={this} editor={editor} />
    }
}

const cx = await cn('HexagonGridPanel-DrawPanel', styles)
interface __DrawPanelComponentProps {
    self: __DrawPanel
    editor: HexagonGridEditor
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DrawPanelComponent({ self, editor }: __DrawPanelComponentProps): ReactNode {
    const b = 'HexagonGridEditor-DrawPanel'

    useEffect(() => {
        self.brushes.color?.forEach(brush => {
            if (brush.default) {
                self.brush = {
                    brush,
                    type: 'color',
                }
            }
        })
    }, [])

    return (
        <div className="HexagonGridEditor-DrawPanel">
            {self.brushes.color && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'color' ? self.brush.brush : undefined
                        }
                        options={self.brushes.color.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'color',
                                }
                            },
                        }))}
                        title="Цвет"
                    />
                </div>
            )}
            {self.brushes.border && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'border'
                                ? self.brush.brush
                                : undefined
                        }
                        options={self.brushes.border.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush ${{ eraser: brush.color == null }}`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'border',
                                }
                            },
                        }))}
                        title="Граница"
                    />
                </div>
            )}
            {self.brushes.border2 && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'border2'
                                ? self.brush.brush
                                : undefined
                        }
                        options={self.brushes.border2.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush ${{ eraser: brush.color == null }}`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'border2',
                                }
                            },
                        }))}
                        title="Граница 2"
                    />
                </div>
            )}
            {self.brushes.circlePosition && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'circlePosition'
                                ? self.brush.brush
                                : undefined
                        }
                        options={self.brushes.circlePosition.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush circle ${{ eraser: brush.position == null }}`}
                                >
                                    {brush.position}
                                </div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'circlePosition',
                                }
                            },
                        }))}
                        title="Позиция Круг"
                    />
                </div>
            )}
            {self.brushes.rectPosition && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'rectPosition'
                                ? self.brush.brush
                                : undefined
                        }
                        options={self.brushes.rectPosition.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush ${{ eraser: brush.position == null }}`}
                                >
                                    {brush.position}
                                </div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'rectPosition',
                                }
                            },
                        }))}
                        title="Позиция Квадрат"
                    />
                </div>
            )}
            {self.brushes.icon && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={
                            self.brush && self.brush.type === 'icon' ? self.brush.brush : undefined
                        }
                        options={self.brushes.icon.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush icon ${{ eraser: brush.icon == null }}`}
                                >
                                    <img src={brush.uiIcon} />
                                </div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = {
                                    brush,
                                    type: 'icon',
                                }
                            },
                        }))}
                        title="Иконка"
                    />
                </div>
            )}
        </div>
    )
}
