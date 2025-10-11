import Canvas from './Canvas'

export interface DrawHexagonParameters {
    x: number
    y: number
    sides?: number[]
    radius: number
    angle?: number
    color?: string
    strokeColor?: string
    strokeWidth?: number
}

declare module './Canvas' {
    interface Canvas {
        drawHexagon(parameters: DrawHexagonParameters): this
    }
}

Canvas.prototype.drawHexagon = function drawHexagon(
    parameters: DrawHexagonParameters
): Canvas {
    this.drawContext.save()
    this.drawContext.beginPath()

    const angle = parameters.angle ?? 0
    const sides = parameters.sides ?? [0, 1, 2, 3, 4, 5]

    if (sides.length === 6) {
        for (let i = 0; i < 6; i++) {
            const x = Math.cos((i / 6 + angle / 360) * Math.PI * 2)
            const y = Math.sin((i / 6 + angle / 360) * Math.PI * 2)
            this.drawContext.lineTo(
                (parameters.x + x * parameters.radius) * this.pixelRatio,
                (parameters.y + y * parameters.radius) * this.pixelRatio
            )
        }
    } else {
        for (const side of sides) {
            const beginX = Math.cos(((side - 1) / 6 + angle / 360) * Math.PI * 2)
            const beginY = Math.sin(((side - 1) / 6 + angle / 360) * Math.PI * 2)
            const endX = Math.cos((side / 6 + angle / 360) * Math.PI * 2)
            const endY = Math.sin((side / 6 + angle / 360) * Math.PI * 2)

            this.drawContext.moveTo(
                (parameters.x + beginX * parameters.radius) * this.pixelRatio,
                (parameters.y + beginY * parameters.radius) * this.pixelRatio
            )
            this.drawContext.lineTo(
                (parameters.x + endX * parameters.radius) * this.pixelRatio,
                (parameters.y + endY * parameters.radius) * this.pixelRatio
            )
        }
    }

    this.drawContext.closePath()

    if (parameters.color) {
        this.drawContext.fillStyle = parameters.color
        this.drawContext.fill()
    }

    if (parameters.strokeColor && parameters.strokeWidth) {
        this.drawContext.strokeStyle = parameters.strokeColor
        this.drawContext.lineWidth = parameters.strokeWidth * this.pixelRatio
        this.drawContext.stroke()
    }

    this.drawContext.restore()
    return this
}
