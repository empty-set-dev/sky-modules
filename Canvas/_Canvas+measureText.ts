export {}

declare global {
    namespace Canvas {
        interface MeasureTextParameters {
            text: string
            font: string
            maxWidth?: number
            textAlign?: CanvasTextAlign
            textBaseline?: CanvasTextBaseline
        }
    }
}

Canvas.prototype.measureText = function measureText(
    this: Canvas,
    parameters: Canvas.MeasureTextParameters
): TextMetrics {
    this.drawContext.save()
    this.drawContext.font = parameters.font
    this.drawContext.textAlign = parameters.textAlign ?? 'center'
    this.drawContext.textBaseline = parameters.textBaseline ?? 'middle'

    const textMetrics = this.drawContext.measureText(parameters.text)

    this.drawContext.restore()

    return textMetrics
}
