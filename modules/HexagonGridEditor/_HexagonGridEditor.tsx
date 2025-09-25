import useUpdateOnAnimationFrame from 'sky/hooks/useUpdateOnAnimationFrame'
import Button from 'sky/react/components/UI/Button'
import Field from 'sky/react/components/UI/Field'
import globalify from 'sky/core/globalify'

import { __DrawPanelParameters } from './__DrawPanel'
import __GridContainer from './__GridContainer'
import { __HexagonData } from './__HexagonData'
import __UIContainer from './__UIContainer'

import styles from './_HexagonGridEditor.module.scss'

declare global {
    interface HexagonGridEditorParameters extends lib.HexagonGridEditorParameters {}
    class HexagonGridEditor extends lib.HexagonGridEditor {}
}

namespace lib {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fileHandle: any

    type ZonesSave = {
        name: string
        title: string
        image: string
        grid: {
            q: number
            r: number
            color?: string
            borderColor?: string
            position?: number
            positionColor?: string
            icon?: string
        }[]
    }[]

    export interface HexagonGridEditorParameters {
        grid?: HexagonGrid
        brushes: __DrawPanelParameters['brushes']
    }
    export interface HexagonGridEditor extends Enability {}
    @enability
    export class HexagonGridEditor {
        readonly effect: Effect
        canvas: Canvas
        gridContainer: __GridContainer
        uiContainer: __UIContainer
        zones: Record<
            string,
            {
                image: string
                title: string
                grid: HexagonGrid<__HexagonData>
            }
        > = {}
        zoneName: string = ''
        zoneTitle: string = ''

        get screen(): string {
            return this.__screen
        }
        private __screen: 'none' | 'draw' = 'none'

        constructor(deps: EffectDeps, parameters: HexagonGridEditorParameters) {
            this.effect = new Effect(deps, this)
            Enability.super(this)

            this.canvas = new Canvas(this.effect, {
                size: (): [number, number] => [window.innerWidth, window.innerHeight],
            })

            this.gridContainer = new __GridContainer(this.canvas.effect, {
                gridEditor: this,
                brushes: parameters.brushes,
            })

            this.uiContainer = new __UIContainer(this.canvas.effect, {
                gridEditor: this,
                brushes: parameters.brushes,
            })

            return asyncConstructor(this, HexagonGridEditor.asyncConstructor)
        }

        static async asyncConstructor(this: HexagonGridEditor): Promise<void> {
            await this.loadZones()
        }

        hideScreen(): this {
            this.__screen = 'none'
            this.gridContainer.enabled = false
            this.uiContainer.enabled = false
            return this
        }
        showDraw(): this {
            this.__screen = 'draw'
            this.gridContainer.enabled = true
            this.uiContainer.enabled = true
            return this
        }

        async loadZones(): Promise<void> {
            const data: ZonesSave = await fetch.json('/zones.json')
            this.zones = {}

            data.forEach(gridParameters => {
                const zone = (this.zones[gridParameters.name] = {
                    image: gridParameters.image,
                    title: gridParameters.title,
                    grid: new HexagonGrid<__HexagonData>(this.effect, {
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

                gridParameters.grid.forEach(parameters => {
                    const hexagon = zone.grid.getHexagon({ q: parameters.q, r: parameters.r })

                    if (hexagon) {
                        hexagon.data.color = parameters.color
                        hexagon.data.borderColor = parameters.borderColor
                        hexagon.data.position = parameters.position
                        hexagon.data.icon = parameters.icon
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
                title: this.zoneTitle,
                grid: this.gridContainer.grid,
            }

            this.zones[this.zoneName].image = image

            await this.saveZones()
        }

        async saveZones(): Promise<void> {
            if (fileHandle == null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;[fileHandle] = await (window as any).showOpenFilePicker()
            }

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
                            color: hexagon.data.color,
                            borderColor: hexagon.data.borderColor,
                            position: hexagon.data.position,
                            icon: hexagon.data.icon,
                        })),
                    }))
                )
            )
            await writableStream.close()
        }

        makeZoneIcon(grid: HexagonGrid<__HexagonData>): string {
            const w = 320 * window.devicePixelRatio
            const h = 320 * window.devicePixelRatio
            const canvas = new Canvas(this.effect, {
                size: (): [number, number] => [w, h],
            })

            this.gridContainer.drawGrid(canvas, grid.hexagons, {
                isCaptured: false,
                opacity: 1,
                x: w / 2,
                y: h / 2,
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

    const cx = cn('[HexagonGridEditor]', styles)
    function HexagonGridEditorComponent(props: {
        menuButton?: ReactNode
        self: HexagonGridEditor
    }): ReactNode {
        const b = `HexagonGridEditor`

        useUpdateOnAnimationFrame()

        if (!props.self.enabled) {
            return
        }

        return (
            <>
                <div
                    className={`
                        ${b}-top-menu
                        UIPanel
                        no-padding
                        no-border-radius
                    `}
                >
                    {props.menuButton}
                </div>
                {props.self.uiContainer.enabled && (
                    <>
                        {props.self.uiContainer.hexagonsPanel.getComponent(props.self)}
                        {props.self.uiContainer.drawPanel.getComponent(props.self)}
                        <div className={cx`${b}-hexagon-name FormGroup`}>
                            <div className="UIGroup">
                                <Field
                                    value={props.self.zoneName}
                                    onChange={ev => {
                                        props.self.zoneName = ev.target.value
                                    }}
                                />
                                <Button onClick={() => props.self.saveZone()}>Сохранить</Button>
                            </div>
                        </div>
                    </>
                )}
            </>
        )
    }
}

globalify(lib)
