export {}

declare global {
    namespace Canvas {
        interface DrawTextParameters {
            x: number
            y: number
            text: string
            font: string
            maxWidth?: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
            textAlign?: CanvasTextAlign
            textBaseline?: CanvasTextBaseline
        }
    }
}

Canvas.prototype.drawText = function drawText(
    this: Canvas,
    parameters: Canvas.DrawTextParameters
): Canvas {
    const { x, y, text, maxWidth } = parameters

    this.drawContext.save()
    this.drawContext.font = parameters.font
    this.drawContext.textAlign = parameters.textAlign ?? 'center'
    this.drawContext.textBaseline = parameters.textBaseline ?? 'middle'

    if (parameters.color) {
        this.drawContext.fillStyle = parameters.color
    }

    this.drawContext.fillText(text, x * this.pixelRatio, y * this.pixelRatio, maxWidth)

    this.drawContext.restore()
    return this
}
