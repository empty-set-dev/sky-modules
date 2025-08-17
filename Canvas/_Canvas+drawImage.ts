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

    const key = color ? `${image}:${color}` : image

    if (images[key] == null) {
        if (color) {
            const imageSource = new Image()

            images[key] = async(async () => {
                const svgXml = await fetch.text(image)
                const coloredSvgXml = svgXml.replace(/#ffffff/g, color)
                imageSource.src = 'data:image/svg+xml,' + encodeURIComponent(coloredSvgXml)
                images[key] = imageSource
            }) as Promise<void> & HTMLImageElement
        } else {
            const imageSource = new Image()
            imageSource.src = image
            images[key] = imageSource
        }
    }

    const imageSource = images[key]

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
