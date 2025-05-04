import Dropdown from 'sky/components/UI/Dropdown'
import globalify from 'sky/utilities/globalify'

import DrawPanel from './__DrawPanel'
import HexagonsPanel from './__HexagonsPanel'

import './_Hexagon.GridEditor.scss'

declare global {
    namespace Hexagon {
        interface GridEditorParameters extends HexagonLib.GridEditorParameters {}
        class GridEditor extends HexagonLib.GridEditor {}
    }
}

namespace HexagonLib {
    const b = `HexagonGridEditor`
    export interface GridEditorParameters {
        grid?: Hexagon.Grid
    }
    export class GridEditor {
        readonly effect: Effect
        readonly grid: Hexagon.Grid
        canvas: Canvas
        opacity: number = 1
        zones: Record<string, Hexagon.Grid[]> = {}
        camera: Vector2 = new Vector2(105, 0)

        get screen(): string {
            return this.__screen
        }
        private __screen: 'none' | 'draw' = 'none'

        constructor(deps: EffectDeps, parameters: GridEditorParameters = {}) {
            this.effect = new Effect(deps, this)
            this.canvas = new Canvas(this.effect, {
                size: (): [number, number] => [window.innerWidth, window.innerHeight],
                pixelRatio: window.devicePixelRatio,
            })
            this.grid =
                parameters.grid ??
                new Hexagon.Grid(this.effect, {
                    hexagonSize: 50,
                    hexagonOrigin: { x: 0, y: 0 },
                    circles: [
                        new Hexagon.Circle({
                            q: 0,
                            r: 0,
                            radius: 4,
                        }),
                    ],
                })

            new HexagonsPanel(this.effect, {
                drawContext: this.canvas.drawContext,
            })

            new DrawPanel(this.effect, {
                drawContext: this.canvas.drawContext,
            })
        }

        hideScreen(): void {
            this.__screen = 'none'
            this.grid.visible = false
        }
        showDraw(): void {
            this.__screen = 'draw'
            this.grid.visible = true
        }

        clickHexagon(point: Vector2): this {
            const hex = this.grid.pointToHex({ x: point.x, y: point.y }, { allowOutside: false })

            if (!hex) {
                return this
            }

            const hexagon = hex.hexagon
            hexagon.color = '#ff5555'

            return this
        }

        getComponent(props: { menuButton?: ReactNode }): ReactNode {
            return (
                <div className={`${b}-top-menu`}>
                    {props.menuButton}
                    <Dropdown
                        className="black"
                        title="Файл"
                        options={[
                            {
                                title: 'Загрузить',
                                onChoice(): void {
                                    //
                                },
                            },
                            {
                                title: 'Сохранить',
                                onChoice(): void {
                                    //
                                },
                            },
                        ]}
                    />
                </div>
            )
        }

        drawGrid(hexagons: Hexagon.Hexagon[], ev: Sky.DrawEvent): void {
            hexagons.forEach(hexagon => {
                const point = {
                    x: ev.position.x + hexagon.position.x,
                    y: ev.position.y + hexagon.position.y,
                }

                Canvas.drawHexagon(this.canvas.drawContext, {
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2,
                    color: hexagon.color,
                    strokeColor: '#888888',
                    strokeWidth: 1,
                })

                // ctx.font = 'normal 100px Helvetica'
                Canvas.drawText(this.canvas.drawContext, {
                    x: point.x,
                    y: point.y,
                    text: 'EROIGJEOHIJEORTIHJORGJOTIGJ',
                    color: '#ffffff',
                })
            })
        }

        afterDrawGrid(hexagons: Hexagon.Hexagon[], ev: Sky.DrawEvent): void {
            hexagons.forEach(hexagon => {
                const point = {
                    x: ev.position.x + hexagon.position.x,
                    y: ev.position.y + hexagon.position.y,
                }

                if (hexagon.areaSides.circle.length > 0) {
                    Canvas.drawHexagon(this.canvas.drawContext, {
                        x: point.x,
                        y: point.y,
                        radius: hexagon.size / 2,
                        sides: hexagon.areaSides.circle,
                        strokeColor: '#ffffff',
                        strokeWidth: 1,
                    })
                }
            })
        }

        protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
            if (this.effect.root.isLeftMousePressed) {
                this.clickHexagon(new Vector2(ev.x, ev.y))
            }
        }

        protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
            this.clickHexagon(new Vector2(ev.x, ev.y))
        }

        protected onGlobalKeyDown(ev: Sky.KeyboardDownEvent): void {
            if (ev.code === 'KeyS' && this.effect.root.isPressed.ControlLeft) {
                localStorage.setItem('grids', JSON.stringify(''))
            }
        }

        @action_hook
        protected draw(ev: Sky.DrawEvent, next: Function): void {
            if (!ev.visible) {
                return
            }

            if (!this.grid.visible) {
                return
            }

            this.drawGrid(this.grid.hexagons, ev)
            this.afterDrawGrid(this.grid.hexagons, ev)

            next()
        }
    }
}

globalify.namespace('Hexagon', HexagonLib)
