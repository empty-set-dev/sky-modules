import globalify from 'sky/utilities/globalify'

import 'sky/features/effect/global'
import HexagonsPanel from './__HexagonsPanel'
import Button from 'sky/components/UI/Button'
import Dropdown from 'sky/components/UI/Dropdown'

declare global {
    namespace Hexagon {
        interface GridEditorParameters extends HexagonLib.GridEditorParameters {}
        class GridEditor extends HexagonLib.GridEditor {}
    }
}

namespace HexagonLib {
    export interface GridEditorParameters {
        grid?: Hexagon.Grid
        drawContext: CanvasRenderingContext2D
    }
    export class GridEditor {
        readonly effect: Effect
        readonly grid: Hexagon.Grid
        opacity: number = 1
        drawContext: CanvasRenderingContext2D
        zones: Record<string, Hexagon.Grid[]> = {}

        get screen() {
            return this.__screen
        }
        private __screen: 'none' | 'draw' = 'none'

        constructor(deps: EffectDeps, parameters: GridEditorParameters) {
            this.effect = new Effect(deps, this)
            this.drawContext = parameters.drawContext
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
                drawContext: this.drawContext,
            })
        }

        hideScreen(): void {
            this.__screen = 'none'
            this.grid.visibility = 'hidden'
        }
        showDraw(): void {
            this.__screen = 'draw'
            this.grid.visibility = 'visible'
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

        Component(props: {menuButton: ReactNode}) {
            return (
                <>
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
                </>
            )
        }

        drawGrid(hexagons: Hexagon.Hexagon[], ev: Sky.DrawEvent): void {
            hexagons.forEach(hexagon => {
                const point = {
                    x: ev.position.x + hexagon.position.x,
                    y: ev.position.y + hexagon.position.y,
                }

                Canvas.drawHexagon(this.drawContext, {
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2,
                    color: hexagon.color,
                    strokeColor: '#888888',
                    strokeWidth: 1,
                })

                // ctx.font = 'normal 100px Helvetica'
                Canvas.drawText(this.drawContext, {
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
                    Canvas.drawHexagon(this.drawContext, {
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
        protected draw(ev: Sky.DrawEvent, next: Function) {
            if (ev.visibility === 'hidden') {
                return
            }

            if (this.grid.visibility === 'hidden') {
                return
            }

            this.drawGrid(this.grid.hexagons, ev)

            next()
        }

        protected afterDraw(ev: Sky.DrawEvent) {
            if (ev.visibility === 'hidden') {
                return
            }

            if (this.grid.visibility === 'hidden') {
                return
            }

            this.afterDrawGrid(this.grid.hexagons, ev)
        }
    }
}

globalify.namespace('Hexagon', HexagonLib)
