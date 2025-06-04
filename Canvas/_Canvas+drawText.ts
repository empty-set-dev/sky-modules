export {}

declare global {
    namespace Canvas {
        interface DrawTextParameters {
            x: number
            y: number
            text: string
            maxWidth?: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }
    }
}

Canvas.prototype.drawText = function drawText(
    this: Canvas,
    parameters: Canvas.DrawTextParameters
): Canvas {
    const { x, y, text, maxWidth } = parameters

    this.drawContext.save()
    this.drawContext.beginPath()
    this.drawContext.fillText(text, x * this.pixelRatio, y * this.pixelRatio, maxWidth)
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
