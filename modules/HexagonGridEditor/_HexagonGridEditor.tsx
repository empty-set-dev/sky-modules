import Button from 'sky/components/UI/Button'
import Field from 'sky/components/UI/Field'
import useUpdateOnAnimationFrame from 'sky/hooks/useUpdateOnAnimationFrame'
import globalify from 'sky/utilities/globalify'

import HexagonGridEditorGridContainer from './__GridContainer'
import HexagonGridEditorUIContainer from './__UIContainer'

import './_HexagonGridEditor.scss'

declare global {
    interface HexagonGridEditorParameters extends module.HexagonGridEditorParameters {}
    class HexagonGridEditor extends module.HexagonGridEditor {}
}

namespace module {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fileHandle: any

    type ZonesSave = {
        name: string
        image: string
        grid: {
            q: number
            r: number
            color: string
        }[]
    }[]

    const b = `HexagonGridEditor`
    export interface HexagonGridEditorParameters {
        grid?: HexagonGrid
    }
    export interface HexagonGridEditor extends Enability {}
    @enability
    export class HexagonGridEditor {
        readonly effect: Effect
        opened: boolean
        canvas: Canvas
        gridContainer: HexagonGridEditorGridContainer
        uiContainer: HexagonGridEditorUIContainer
        zones: Record<
            string,
            {
                image: string
                grid: HexagonGrid
            }
        > = {}
        zoneName: string = ''
        zonesPromise: Promise<void>

        get screen(): string {
            return this.__screen
        }
        private __screen: 'none' | 'draw' = 'none'

        constructor(deps: EffectDeps, parameters: HexagonGridEditorParameters = {}) {
            this.effect = new Effect(deps, this)
            Enability.super(this)
            this.opened = false

            this.canvas = new Canvas(this.effect, {
                size: (): [number, number] => [window.innerWidth, window.innerHeight],
                pixelRatio: window.devicePixelRatio,
            })
            this.gridContainer = new HexagonGridEditorGridContainer(this.effect, {
                gridEditor: this,
                grid: parameters.grid,
            })
            this.uiContainer = new HexagonGridEditorUIContainer(this.effect, this)

            const [promise, resolve] = Promise.create()
            this.zonesPromise = promise

            new WindowEventListener('click', () => this.loadZones().then(resolve), this.effect, {
                once: true,
            })
        }

        hideScreen(): void {
            this.__screen = 'none'
            this.gridContainer.enabled = false
        }
        showDraw(): void {
            this.__screen = 'draw'
            this.gridContainer.enabled = true
        }

        clickHexagon(point: Vector2): this {
            const hex = this.gridContainer.grid.pointToHex(
                { x: point.x, y: point.y },
                { allowOutside: false }
            )

            if (!hex) {
                return this
            }

            const hexagon = hex.hexagon
            hexagon.color = this.uiContainer.drawPanel.color

            return this
        }

        async loadZones(): Promise<void> {
            if (fileHandle == null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;[fileHandle] = await (window as any).showOpenFilePicker()
            }

            document.getElementById('access')?.remove()

            const file = await fileHandle.getFile()
            const json = await file.text()
            const data: ZonesSave = json !== '' ? JSON.parse(json) : []
            this.zones = {}

            data.forEach(grid => {
                const zone = (this.zones[grid.name] = {
                    image: grid.image,
                    grid: new HexagonGrid(this.effect, {
                        hexagonSize: 50,
                        hexagonOrigin: { x: 0, y: 0 },
                        circles: [
                            new HexagonCircle({
                                q: 0,
                                r: 0,
                                radius: 4,
                            }),
                        ],
                    }),
                })

                grid.grid.forEach(hexagon => {
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
                return
            }

            const image = this.makeZoneIcon(this.gridContainer.grid)

            this.zones[this.zoneName] ??= {
                image,
                grid: this.gridContainer.grid,
            }

            this.zones[this.zoneName].image = image

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

        makeZoneIcon(grid: HexagonGrid): string {
            const w = 320 * window.devicePixelRatio
            const h = 320 * window.devicePixelRatio
            const canvas = new Canvas(this.effect, {
                size: (): [number, number] => [w, h],
                pixelRatio: window.devicePixelRatio,
            })

            this.gridContainer.drawGrid(canvas.drawContext, grid.hexagons, {
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
            return <HexagonGridEditorComponent {...props} self={this} />
        }

        protected onGlobalKeyDown(ev: Sky.KeyboardDownEvent): void {
            if (!this.gridContainer.enabled) {
                return
            }

            if (ev.code === 'KeyN') {
                this.gridContainer.grid = new HexagonGrid(this.effect, {
                    hexagonSize: 50,
                    hexagonOrigin: { x: 0, y: 0 },
                    circles: [
                        new HexagonCircle({
                            q: 0,
                            r: 0,
                            radius: 4,
                        }),
                    ],
                })
            }
        }
    }

    function HexagonGridEditorComponent(props: {
        menuButton?: ReactNode
        self: HexagonGridEditor
    }): ReactNode {
        useUpdateOnAnimationFrame()

        if (!props.self.enabled) {
            return
        }

        return (
            <>
                <div className={`${b}-top-menu`}>{props.menuButton}</div>
                {props.self.gridContainer.enabled && (
                    <>
                        {props.self.uiContainer.hexagonsPanel.getComponent(props.self)}
                        <div className={`${b}-hexagon-name`}>
                            <Field
                                value={props.self.zoneName}
                                onChange={ev => {
                                    props.self.zoneName = ev.target.value
                                }}
                            />
                            <Button onClick={() => props.self.saveZone()}>Сохранить</Button>
                        </div>
                    </>
                )}
            </>
        )
    }
}

globalify(module)
