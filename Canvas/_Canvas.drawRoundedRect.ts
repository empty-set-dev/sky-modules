export {}

declare global {
    namespace Canvas {
        interface DrawRoundRectParameters {
            x: number
            y: number
            w: number
            h: number
            radius: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }
        interface DrawRectWithoutTopBorderParameters {
            x: number
            y: number
            w: number
            h: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }
    }
}

Canvas.prototype.drawRoundedRect = function drawRoundedRect(
    this: Canvas,
    parameters: Canvas.DrawRoundRectParameters
): Canvas {
    const { x, y, w, h, radius } = parameters

    this.drawContext.save()

    this.drawContext.beginPath()

    this.drawContext.roundRect(
        x * this.pixelRatio,
        y * this.pixelRatio,
        w * this.pixelRatio,
        h * this.pixelRatio,
        radius * this.pixelRatio
    )

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

Canvas.prototype.drawTopRoundedRect = function drawTopRoundedRect(
    this: Canvas,
    parameters: Canvas.DrawRoundRectParameters
): Canvas {
    const { x, y, w, h, radius } = parameters

    this.drawContext.save()

    this.drawContext.beginPath()

    this.moveTo(x, y + radius)
    this.arcTo(x, y, x + radius, y, radius)
    this.lineTo(x + w - radius, y)
    this.arcTo(x + w, y, x + w, y + radius, radius)
    this.lineTo(x + w, y + h)
    this.lineTo(x, y + h)
    this.lineTo(x, y + radius)

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

Canvas.prototype.drawBottomRoundedRect = function drawBottomRoundedRect(
    this: Canvas,
    parameters: Canvas.DrawRoundRectParameters
): Canvas {
    const { x, y, w, h, radius } = parameters

    this.drawContext.save()

    this.drawContext.beginPath()

    this.moveTo(x, y)
    this.lineTo(x + w, y)
    this.lineTo(x + w, y + h - radius)
    this.arcTo(x + w, y + h, x + w - radius, y + h, radius)
    this.lineTo(x + w - radius, y + h)
    this.arcTo(x, y + h, x, y + h - radius, radius)
    this.lineTo(x, y)

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

Canvas.prototype.drawRectWithoutTopBorder = function drawRectWithoutTopBorder(
    this: Canvas,
    parameters: Canvas.DrawRectWithoutTopBorderParameters
): Canvas {
    const { x, y, w, h } = parameters

    this.drawContext.save()

    this.drawContext.beginPath()

    this.moveTo(x, y)
    this.lineTo(x, y + h)
    this.lineTo(x + w, y + h)
    this.lineTo(x + w, y)

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
