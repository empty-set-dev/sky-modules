Canvas.prototype.moveTo = function moveTo(this: Canvas, x: number, y: number): Canvas {
    this.drawContext.moveTo(x * this.pixelRatio, y * this.pixelRatio)
    return this
}

Canvas.prototype.lineTo = function lineTo(this: Canvas, x: number, y: number): Canvas {
    this.drawContext.lineTo(x * this.pixelRatio, y * this.pixelRatio)
    return this
}

Canvas.prototype.arcTo = function lineTo(
    this: Canvas,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number
): Canvas {
    this.drawContext.arcTo(
        x1 * this.pixelRatio,
        y1 * this.pixelRatio,
        x2 * this.pixelRatio,
        y2 * this.pixelRatio,
        radius * this.pixelRatio
    )
    return this
}
