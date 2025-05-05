import Button from 'sky/components/UI/Button'
import Field from 'sky/components/UI/Field'
import ScreenMoveController2D from 'sky/controllers/ScreenMoveController2D'
import WasdController2D from 'sky/controllers/WasdController2D'
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
    export interface GridEditor extends Enability {}
    @enability
    export class GridEditor {
        readonly effect: Effect
        grid: Hexagon.Grid
        canvas: Canvas
        zones: Record<
            string,
            {
                image: string
                grid: Hexagon.Grid
            }
        > = {}
        camera: Vector2 = new Vector2(-105, 0)
        wasdController2D: WasdController2D
        screenMoveController2D: ScreenMoveController2D
        drawPanel: DrawPanel
        hexagonsPanel: HexagonsPanel
        zoneName: string = ''

        get screen(): string {
            return this.__screen
        }
        private __screen: 'none' | 'draw' = 'none'

        constructor(deps: EffectDeps, parameters: GridEditorParameters = {}) {
            this.effect = new Effect(deps, this)
            Enability.super(this)
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

            this.wasdController2D = new WasdController2D(this.effect)
            this.screenMoveController2D = new ScreenMoveController2D(this.effect, {
                camera: this.camera,
            })

            this.hexagonsPanel = new HexagonsPanel(this.effect, {
                drawContext: this.canvas.drawContext,
            })

            this.drawPanel = new DrawPanel(this.effect, {
                drawContext: this.canvas.drawContext,
            })
            this.drawPanel.camera = this.camera

            new WindowEventListener('click', () => this.loadZones(), this.effect, {
                once: true,
            })
        }

        hideScreen(): void {
            this.__screen = 'none'
            this.grid.enabled = false
        }
        showDraw(): void {
            this.__screen = 'draw'
            this.grid.enabled = true
        }

        clickHexagon(point: Vector2): this {
            const hex = this.grid.pointToHex({ x: point.x, y: point.y }, { allowOutside: false })

            if (!hex) {
                return this
            }

            const hexagon = hex.hexagon
            hexagon.color = this.drawPanel.color

            return this
        }

        async loadZones(): Promise<void> {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [fileHandle] = await (window as any).showOpenFilePicker()

            const file = await fileHandle.getFile()
            const json = await file.text()
            const data = json !== '' ? JSON.parse(json) : []
            this.zones = {}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.forEach((grid: any) => {
                const zone = (this.zones[grid.name] = {
                    image: grid.image,
                    grid: new Hexagon.Grid(this.effect, {
                        hexagonSize: 50,
                        hexagonOrigin: { x: 0, y: 0 },
                        circles: [
                            new Hexagon.Circle({
                                q: 0,
                                r: 0,
                                radius: 4,
                            }),
                        ],
                    }),
                })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                grid.grid.forEach((hexagon: any) => {
                    const hex = zone.grid.getHex({ q: hexagon.q, r: hexagon.r })

                    if (hex) {
                        hex.hexagon.color = hexagon.color
                    }
                })
            })
        }

        async saveZone(): Promise<void> {
            if (!this.zoneName) {
                alert('Введите имя')
            }

            this.zones[this.zoneName] ??= {
                image: this.drawZoneIcon(this.zoneName, this.grid),
                grid: this.grid,
            }

            await this.saveZones()
        }

        async saveZones(): Promise<void> {
            const zones = Object.keys(this.zones)
                .sort((a, b) => a.localeCompare(b))
                .map(name => ({
                    name,
                    image: this.zones[name].image,
                    grid: this.zones[name].grid,
                }))

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileHandle = await (window as any).showSaveFilePicker()
            const writableStream = await fileHandle.createWritable()
            await writableStream.write(
                JSON.stringify(
                    zones.map(zone => ({
                        name: zone.name,
                        image: zone.image,
                        grid: zone.grid.hexagons.map(hexagon => ({
                            q: hexagon.q,
                            r: hexagon.r,
                            color: hexagon.color,
                        })),
                    }))
                )
            )
            await writableStream.close()
        }

        drawZoneIcon(name: string, grid: Hexagon.Grid): string {
            const w = 320 * window.devicePixelRatio
            const h = 320 * window.devicePixelRatio
            const canvas = new Canvas(this.effect, {
                size: (): [number, number] => [w, h],
                pixelRatio: window.devicePixelRatio,
            })

            this.__drawGrid(canvas.drawContext, grid.hexagons, {
                isCaptured: false,
                opacity: 1,
                position: new Vector2(w / 2, h / 2),
                visible: true,
            })

            this.__afterDrawGrid(canvas.drawContext, grid.hexagons, {
                isCaptured: false,
                opacity: 1,
                position: new Vector2(w / 2, h / 2),
                visible: true,
            })

            const dataUrl = canvas.domElement.toDataURL('image/png')
            canvas.effect.destroy()

            return dataUrl
        }

        @bind
        getComponent(props: { menuButton?: ReactNode }): ReactNode {
            return (
                <>
                    <div className={`${b}-top-menu`}>{props.menuButton}</div>
                    {this.hexagonsPanel.getComponent(this)}
                    <div className={`${b}-hexagon-name`}>
                        <Field
                            onChange={ev => {
                                this.zoneName = ev.target.value
                            }}
                        />
                        <Button onClick={() => this.saveZone()}>Сохранить</Button>
                    </div>
                </>
            )
        }

        private __drawGrid(
            drawContext: CanvasRenderingContext2D,
            hexagons: Hexagon.Hexagon[],
            ev: Sky.DrawEvent
        ): void {
            hexagons.forEach(hexagon => {
                const point = {
                    x: ev.position.x + hexagon.position.x,
                    y: ev.position.y + hexagon.position.y,
                }

                Canvas.drawHexagon(drawContext, {
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2,
                    color: hexagon.color,
                    strokeColor: '#888888',
                    strokeWidth: 1,
                })
            })
        }

        private __afterDrawGrid(
            drawContext: CanvasRenderingContext2D,
            hexagons: Hexagon.Hexagon[],
            ev: Sky.DrawEvent
        ): void {
            hexagons.forEach(hexagon => {
                const point = {
                    x: ev.position.x + hexagon.position.x,
                    y: ev.position.y + hexagon.position.y,
                }

                if (hexagon.areaSides.circle.length > 0) {
                    Canvas.drawHexagon(drawContext, {
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
            this.__transformMouse(ev)

            if (this.effect.root.isLeftMousePressed) {
                this.clickHexagon(new Vector2(ev.x, ev.y))
            }
        }

        protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
            this.__transformMouse({ ...ev })

            this.clickHexagon(new Vector2(ev.x, ev.y))
        }

        protected update(ev: Sky.UpdateEvent): void {
            const cameraAcceleration = this.wasdController2D.acceleration
                .clone()
                .multiplyScalar(ev.dt * 1000)

            this.camera.x += cameraAcceleration.x
            this.camera.y -= cameraAcceleration.y
        }

        @action_hook
        protected draw(ev: Sky.DrawEvent, next: Function): void {
            if (!ev.visible) {
                return
            }

            this.canvas.drawContext.clearRect(
                0,
                0,
                this.canvas.domElement.width,
                this.canvas.domElement.height
            )

            ev.position.x += window.innerWidth / 2 - this.camera.x
            ev.position.y += window.innerHeight / 2 - this.camera.y

            this.__drawGrid(this.canvas.drawContext, this.grid.hexagons, ev)
            this.__afterDrawGrid(this.canvas.drawContext, this.grid.hexagons, ev)

            next()
        }

        private __transformMouse(mouse: Sky.MouseEvent): void {
            mouse.x += this.camera.x - window.innerWidth / 2
            mouse.y += this.camera.y - window.innerHeight / 2
        }
    }
}

globalify.namespace('Hexagon', HexagonLib)
