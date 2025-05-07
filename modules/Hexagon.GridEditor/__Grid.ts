export default class GridEditorGrid extends Hexagon.Grid {
    @action_hook
    protected draw(ev: Sky.DrawEvent, next: Function): void {
        if (!this.enabled) {
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
