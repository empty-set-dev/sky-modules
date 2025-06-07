export {}

declare global {
    namespace Canvas {
        interface DrawImageParameters {
            x: number
            y: number
            w: number
            h: number
            image: string
        }
    }
}

let images: Record<string, CanvasImageSource> = {}
Canvas.prototype.drawImage = function drawImaget(
    this: Canvas,
    parameters: Canvas.DrawImageParameters
): Canvas {
    const { x, y, w, h, image } = parameters

    this.drawContext.save()

    if (!images[image]) {
        const imageSource = new Image()
        imageSource.src = image
        images[image] = imageSource
    }

    const imageSource = images[image]

    this.drawContext.drawImage(
        imageSource,
        x * this.pixelRatio,
        y * this.pixelRatio,
        w * this.pixelRatio,
        h * this.pixelRatio
    )

    this.drawContext.restore()
    return this
}
