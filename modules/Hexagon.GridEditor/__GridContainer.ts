import ScreenMoveController2D from 'sky/controllers/ScreenMoveController2D'
import WasdController2D from 'sky/controllers/WasdController2D'

export interface HexagonGridEditorGridContainerParameters {
    grid?: Hexagon.Grid
}
export default interface HexagonGridEditorGridContainer extends Enability {}
@enability
export default class HexagonGridEditorGridContainer {
    readonly effect: Effect
    grid: Hexagon.Grid
    camera: Vector2 = new Vector2(-105, 0)
    wasdController2D: WasdController2D
    screenMoveController2D: ScreenMoveController2D

    constructor(deps: EffectDeps, parameters: HexagonGridEditorGridContainerParameters = {}) {
        this.effect = new Effect(deps, this)
        Enability.super(this)
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
    }

    @action_hook
    protected draw(ev: Sky.DrawEvent, next: Function): void {
        if (!this.grid.enabled) {
            return
        }

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

        next()
    }

    private __transformMouse(mouse: Sky.MouseEvent): void {
        mouse.x += this.camera.x - window.innerWidth / 2
        mouse.y += this.camera.y - window.innerHeight / 2
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
}
