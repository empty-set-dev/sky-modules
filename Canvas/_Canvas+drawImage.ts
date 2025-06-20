export {}

declare global {
    namespace Canvas {
        interface DrawImageParameters {
            x: number
            y: number
            w: number
            h: number
            image: string
            color?: string
        }
    }
}

let images: Record<string, CanvasImageSource> = {}
Canvas.prototype.drawImage = function drawImaget(
    this: Canvas,
    parameters: Canvas.DrawImageParameters
): Canvas {
    const { x, y, w, h, image, color } = parameters

    if (!images[image]) {
        if (color) {
            const imageSource = new Image()

            images[image] = until(async () => {
                const svgXml = await fetch.text(image)
                const coloredSvgXml = svgXml.replace(/#ffffff/g, color)
                imageSource.src = 'data:image/svg+xml,' + encodeURIComponent(coloredSvgXml)
                images[image] = imageSource
            }) as never
        } else {
            const imageSource = new Image()
            imageSource.src = image
            images[image] = imageSource
        }
    }

    const imageSource = images[image]

    if (imageSource instanceof Promise) {
        return this
    }

    this.drawContext.drawImage(
        imageSource,
        x * this.pixelRatio,
        y * this.pixelRatio,
        w * this.pixelRatio,
        h * this.pixelRatio
    )

    return this
}
