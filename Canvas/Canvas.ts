import EffectDep from '@sky-modules/features/effect/EffectDep'

import { lib as CanvasSpritelib } from './_Canvas.Sprite'

export interface CanvasParameters {
    size(): [number, number]
    pixelRatio?: number
}
export default class Canvas extends CanvasSpritelib.Sprite {
    static context = true

    size: () => [number, number]
    readonly domElement: HTMLCanvasElement
    readonly drawContext: CanvasRenderingContext2D
    readonly pixelRatio: number

    constructor(dep: EffectDep, parameters: CanvasParameters) {
        super(dep)
        this.size = parameters.size
        this.domElement = document.createElement('canvas')
        this.drawContext = notNull(
            this.domElement.getContext('2d'),
            'Canvas: get domElement 2d context'
        )
        this.pixelRatio = parameters.pixelRatio ?? window.devicePixelRatio
    }

    onResize(): this {
        const [w, h] = this.size()
        this.domElement.width = w * window.devicePixelRatio
        this.domElement.height = h * window.devicePixelRatio
        this.domElement.style.transform = `scale(${(100 / window.devicePixelRatio).toFixed(2)}%)`
        return this
    }

    clear(): this {
        this.drawContext.clearRect(0, 0, this.domElement.width, this.domElement.height)
        return this
    }

    moveTo(x: number, y: number): this {
        this.drawContext.moveTo(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    lineTo(x: number, y: number): this {
        this.drawContext.lineTo(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this.drawContext.arcTo(
            x1 * this.pixelRatio,
            y1 * this.pixelRatio,
            x2 * this.pixelRatio,
            y2 * this.pixelRatio,
            radius * this.pixelRatio
        )
        return this
    }

    arc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean
    ): this {
        this.drawContext.arc(
            x * this.pixelRatio,
            y * this.pixelRatio,
            radius * this.pixelRatio,
            startAngle,
            endAngle,
            counterclockwise
        )
        return this
    }

    rect(x: number, y: number, width: number, height: number): this {
        this.drawContext.rect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    ellipse(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        rotation: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean
    ): this {
        this.drawContext.ellipse(
            x * this.pixelRatio,
            y * this.pixelRatio,
            radiusX * this.pixelRatio,
            radiusY * this.pixelRatio,
            rotation,
            startAngle,
            endAngle,
            counterclockwise
        )
        return this
    }

    bezierCurveTo(
        cp1x: number,
        cp1y: number,
        cp2x: number,
        cp2y: number,
        x: number,
        y: number
    ): this {
        this.drawContext.bezierCurveTo(
            cp1x * this.pixelRatio,
            cp1y * this.pixelRatio,
            cp2x * this.pixelRatio,
            cp2y * this.pixelRatio,
            x * this.pixelRatio,
            y * this.pixelRatio
        )
        return this
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
        this.drawContext.quadraticCurveTo(
            cpx * this.pixelRatio,
            cpy * this.pixelRatio,
            x * this.pixelRatio,
            y * this.pixelRatio
        )
        return this
    }

    beginPath(): this {
        this.drawContext.beginPath()
        return this
    }

    closePath(): this {
        this.drawContext.closePath()
        return this
    }

    fill(): this {
        this.drawContext.fill()
        return this
    }

    stroke(): this {
        this.drawContext.stroke()
        return this
    }

    clip(): this {
        this.drawContext.clip()
        return this
    }

    save(): this {
        this.drawContext.save()
        return this
    }

    restore(): this {
        this.drawContext.restore()
        return this
    }

    scale(x: number, y: number): this {
        this.drawContext.scale(x, y)
        return this
    }

    rotate(angle: number): this {
        this.drawContext.rotate(angle)
        return this
    }

    translate(x: number, y: number): this {
        this.drawContext.translate(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): this {
        this.drawContext.transform(a, b, c, d, e * this.pixelRatio, f * this.pixelRatio)
        return this
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): this {
        this.drawContext.setTransform(a, b, c, d, e * this.pixelRatio, f * this.pixelRatio)
        return this
    }

    resetTransform(): this {
        this.drawContext.resetTransform()
        return this
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): this {
        this.drawContext.fillText(
            text,
            x * this.pixelRatio,
            y * this.pixelRatio,
            maxWidth ? maxWidth * this.pixelRatio : undefined
        )
        return this
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): this {
        this.drawContext.strokeText(
            text,
            x * this.pixelRatio,
            y * this.pixelRatio,
            maxWidth ? maxWidth * this.pixelRatio : undefined
        )
        return this
    }

    fillRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.fillRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    strokeRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.strokeRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    clearRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.clearRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    setFillStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.drawContext.fillStyle = style
        return this
    }

    setStrokeStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.drawContext.strokeStyle = style
        return this
    }

    setLineWidth(width: number): this {
        this.drawContext.lineWidth = width * this.pixelRatio
        return this
    }

    setLineCap(cap: CanvasLineCap): this {
        this.drawContext.lineCap = cap
        return this
    }

    setLineJoin(join: CanvasLineJoin): this {
        this.drawContext.lineJoin = join
        return this
    }

    setMiterLimit(limit: number): this {
        this.drawContext.miterLimit = limit
        return this
    }

    setLineDash(segments: number[]): this {
        this.drawContext.setLineDash(segments.map(s => s * this.pixelRatio))
        return this
    }

    setLineDashOffset(offset: number): this {
        this.drawContext.lineDashOffset = offset * this.pixelRatio
        return this
    }

    setFont(font: string): this {
        this.drawContext.font = font
        return this
    }

    setTextAlign(align: CanvasTextAlign): this {
        this.drawContext.textAlign = align
        return this
    }

    setTextBaseline(baseline: CanvasTextBaseline): this {
        this.drawContext.textBaseline = baseline
        return this
    }

    setGlobalAlpha(alpha: number): this {
        this.drawContext.globalAlpha = alpha
        return this
    }

    setGlobalCompositeOperation(operation: GlobalCompositeOperation): this {
        this.drawContext.globalCompositeOperation = operation
        return this
    }

    setShadowBlur(blur: number): this {
        this.drawContext.shadowBlur = blur * this.pixelRatio
        return this
    }

    setShadowColor(color: string): this {
        this.drawContext.shadowColor = color
        return this
    }

    setShadowOffsetX(offset: number): this {
        this.drawContext.shadowOffsetX = offset * this.pixelRatio
        return this
    }

    setShadowOffsetY(offset: number): this {
        this.drawContext.shadowOffsetY = offset * this.pixelRatio
        return this
    }
}
