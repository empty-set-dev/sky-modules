Canvas.prototype.measureText = function measureText(this: Canvas, text: string): TextMetrics {
    return this.drawContext.measureText(text)
}
