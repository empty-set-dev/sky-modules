import ScreenMoveController2D from 'sky/controllers/ScreenMoveController2D'
import WasdController2D from 'sky/controllers/WasdController2D'

import { __HexagonData } from './__HexagonData'

export interface __GridContainerParameters {
    gridEditor: HexagonGridEditor
}
export default interface __GridContainer extends Enability {}
@enability
export default class __GridContainer extends Canvas.Sprite {
    readonly gridEditor: HexagonGridEditor
    grid: HexagonGrid<__HexagonData>
    camera: Vector2 = new Vector2(-105, 0)
    wasdController2D: WasdController2D
    screenMoveController2D: ScreenMoveController2D

    constructor(deps: EffectDeps, parameters: __GridContainerParameters) {
        super(deps)
        Enability.super(this)

        this.gridEditor = parameters.gridEditor

        this.grid = new HexagonGrid<__HexagonData>(this.effect, {
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

        this.wasdController2D = new WasdController2D(this.effect)

        this.screenMoveController2D = new ScreenMoveController2D(this.effect, {
            camera: this.camera,
        })
    }

    clickHexagon(point: Vector2): this {
        const hex = this.gridEditor.gridContainer.grid.pointToHex(
            { x: point.x, y: point.y },
            { allowOutside: false }
        )

        if (!hex) {
            return this
        }

        const hexagon: Hexagon<__HexagonData> = hex.hexagon as never

        if (this.gridEditor.uiContainer.drawPanel.brush.type === 'color') {
            hexagon.data.color = this.gridEditor.uiContainer.drawPanel.brush.color
        }
        if (this.gridEditor.uiContainer.drawPanel.brush.type === 'border') {
            hexagon.data.borderColor = this.gridEditor.uiContainer.drawPanel.brush.color
        }
        if (this.gridEditor.uiContainer.drawPanel.brush.type === 'border2') {
            hexagon.data.border2Color = this.gridEditor.uiContainer.drawPanel.brush.color
        }
        if (this.gridEditor.uiContainer.drawPanel.brush.type === 'center') {
            hexagon.data.centerColor = this.gridEditor.uiContainer.drawPanel.brush.color
        }

        return this
    }

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (ev.isCaptured) {
            return
        }

        this.clickHexagon(new Vector2(ev.x, ev.y))
    }

    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
        if (ev.isCaptured) {
            return
        }

        if (this.effect.root.isLeftMousePressed) {
            this.clickHexagon(new Vector2(ev.x, ev.y))
        }
    }

    protected update(ev: Sky.UpdateEvent): void {
        const cameraAcceleration = this.wasdController2D.acceleration
            .clone()
            .multiplyScalar(ev.dt * 1000)

        this.camera.x += cameraAcceleration.x
        this.camera.y -= cameraAcceleration.y

        this.position.x = window.innerWidth / 2 - this.camera.x
        this.position.y = window.innerHeight / 2 - this.camera.y
    }

    protected draw(ev: Sky.DrawEvent): void {
        const canvas = this.effect.context(Canvas)

        this.gridEditor.canvas.drawContext.clearRect(
            0,
            0,
            this.gridEditor.canvas.domElement.width,
            this.gridEditor.canvas.domElement.height
        )

        this.drawGrid(canvas, this.grid.hexagons, ev)
    }

    drawGrid(canvas: Canvas, hexagons: Hexagon<__HexagonData>[], ev: Sky.DrawEvent): void {
        hexagons.forEach(hexagon => {
            const point = {
                x: ev.x + hexagon.position.x,
                y: ev.y + hexagon.position.y,
            }

            canvas.drawHexagon({
                x: point.x,
                y: point.y,
                radius: hexagon.size / 2,
                color: hexagon.data.color,
                strokeColor: '#666666',
                strokeWidth: 2,
            })

            if (hexagon.data.borderColor) {
                canvas.drawHexagon({
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2 - 2,
                    strokeColor: hexagon.data.borderColor,
                    strokeWidth: 3,
                })
            }
        })

        hexagons.forEach(hexagon => {
            const point = {
                x: ev.x + hexagon.position.x,
                y: ev.y + hexagon.position.y,
            }

            if (hexagon.data.borderColor) {
                canvas.drawHexagon({
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2 - 4,
                    strokeColor: hexagon.data.borderColor,
                    strokeWidth: 4,
                })
            }
        })

        hexagons.forEach(hexagon => {
            const point = {
                x: ev.x + hexagon.position.x,
                y: ev.y + hexagon.position.y,
            }

            if (hexagon.data.border2Color) {
                canvas.drawHexagon({
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2 - 10,
                    strokeColor: hexagon.data.border2Color,
                    strokeWidth: 3,
                })
            }
        })

        hexagons.forEach(hexagon => {
            const point = {
                x: ev.x + hexagon.position.x,
                y: ev.y + hexagon.position.y,
            }

            if (hexagon.data.centerColor) {
                canvas.drawHexagon({
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2 - 30,
                    color: hexagon.data.centerColor,
                })
            }
        })

        hexagons.forEach(hexagon => {
            const point = {
                x: ev.x + hexagon.position.x,
                y: ev.y + hexagon.position.y,
            }

            if (hexagon.areaSides.circle.length > 0) {
                canvas.drawHexagon({
                    x: point.x,
                    y: point.y,
                    radius: hexagon.size / 2,
                    sides: hexagon.areaSides.circle,
                    strokeColor: '#666666',
                    strokeWidth: 4,
                })
            }
        })
    }
}
