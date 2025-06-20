import Dropdown from 'sky/components/UI/Dropdown'

import styles from './__DrawPanel.module.scss'

export interface __DrawPanelParameters {
    brushes: {
        color?: HexagonGridEditor.BrushDescription[]
        border?: HexagonGridEditor.BrushDescription[]
        border2?: HexagonGridEditor.BrushDescription[]
        circlePosition?: HexagonGridEditor.BrushDescription[]
        rectPosition?: HexagonGridEditor.BrushDescription[]
        icon?: HexagonGridEditor.BrushDescription[]
    }
}
export default interface __DrawPanel extends Enability {}
@enability
export default class __DrawPanel extends Canvas.Sprite {
    w!: number
    h!: number
    brushes!: {
        color?: HexagonGridEditor.Brush[]
        border?: HexagonGridEditor.Brush[]
        border2?: HexagonGridEditor.Brush[]
        circlePosition?: HexagonGridEditor.Brush[]
        rectPosition?: HexagonGridEditor.Brush[]
        icon?: HexagonGridEditor.Brush[]
    }
    brush!: HexagonGridEditor.Brush

    constructor(deps: EffectDeps, parameters: __DrawPanelParameters) {
        super(deps)
        Enability.super(this)

        this.position = new Vector2(210, 44)

        this.brushes = {
            color: parameters.brushes.color?.map(brush => ({ ...brush, type: 'color' })),
            border: parameters.brushes.border?.map(brush => ({ ...brush, type: 'border' })),
            border2: parameters.brushes.border2?.map(brush => ({ ...brush, type: 'border2' })),
            circlePosition: parameters.brushes.circlePosition?.map(brush => ({
                ...brush,
                type: 'circlePosition',
            })),
            rectPosition: parameters.brushes.rectPosition?.map(brush => ({
                ...brush,
                type: 'rectPosition',
            })),
            icon: parameters.brushes.icon?.map(brush => ({ ...brush, type: 'icon' })),
        }
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
                self.brush = brush
            }
        })
    }, [])

    return (
        <div className="HexagonGridEditor-DrawPanel" {...captureUI(self.effect)}>
            {self.brushes.color && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={self.brush && self.brush.type === 'color' ? self.brush : undefined}
                        options={self.brushes.color.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = brush
                            },
                        }))}
                        title="Цвет"
                    />
                </div>
            )}
            {self.brushes.border && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={self.brush && self.brush.type === 'border' ? self.brush : undefined}
                        options={self.brushes.border.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush ${{ eraser: brush.color == null }}`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = brush
                            },
                        }))}
                        title="Граница"
                    />
                </div>
            )}
            {self.brushes.border2 && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={self.brush && self.brush.type === 'border2' ? self.brush : undefined}
                        options={self.brushes.border2.map(brush => ({
                            title: (
                                <div
                                    className={cx`${b}-brush ${{ eraser: brush.color == null }}`}
                                    style={{ background: brush.color }}
                                ></div>
                            ),
                            value: brush,
                            onChoice(): void {
                                self.brush = brush
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
                                ? self.brush
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
                                self.brush = brush
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
                                ? self.brush
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
                                self.brush = brush
                            },
                        }))}
                        title="Позиция Квадрат"
                    />
                </div>
            )}
            {self.brushes.icon && (
                <div className={cx`${b}-select`}>
                    <Dropdown
                        value={self.brush && self.brush.type === 'icon' ? self.brush : undefined}
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
                                self.brush = brush
                            },
                        }))}
                        title="Иконка"
                    />
                </div>
            )}
        </div>
    )
}
