export {}

declare global {
    namespace Canvas {
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
    }
}

Canvas.prototype.drawHexagon = function drawHexagon(
    parameters: Canvas.DrawHexagonParameters
): Canvas {
    this.drawContext.save()

    this.drawContext.beginPath()

    const angle = parameters.angle ?? 0

    const sides = parameters.sides ?? [0, 1, 2, 3, 4, 5]

    if (sides.length === 6) {
        for (let i = 0; i < 6; i++) {
            const x = Math.cos((i / 6 + angle / 360) * Math.PI * 2)
            const y = Math.sin((i / 6 + angle / 360) * Math.PI * 2)
            this.lineTo(parameters.x + x * parameters.radius, parameters.y + y * parameters.radius)
        }
    } else {
        sides.forEach(side => {
            const beginX = Math.cos(((side - 1) / 6 + angle / 360) * Math.PI * 2)
            const beginY = Math.sin(((side - 1) / 6 + angle / 360) * Math.PI * 2)
            const endX = Math.cos((side / 6 + angle / 360) * Math.PI * 2)
            const endY = Math.sin((side / 6 + angle / 360) * Math.PI * 2)
            this.moveTo(
                parameters.x + beginX * parameters.radius,
                parameters.y + beginY * parameters.radius
            )
            this.lineTo(
                parameters.x + endX * parameters.radius,
                parameters.y + endY * parameters.radius
            )
        })
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
