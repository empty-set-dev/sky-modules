/**
 * Style manager for canvas rendering
 * Manages all canvas styling operations
 */
export class StyleManager {
    private context: CanvasRenderingContext2D
    private pixelRatio: number

    constructor(context: CanvasRenderingContext2D, pixelRatio: number) {
        this.context = context
        this.pixelRatio = pixelRatio
    }

    // Fill and stroke styles
    setFillStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.context.fillStyle = style
        return this
    }

    setStrokeStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.context.strokeStyle = style
        return this
    }

    // Line styles
    setLineWidth(value: number): this {
        this.context.lineWidth = value * this.pixelRatio
        return this
    }

    setLineCap(value: CanvasLineCap): this {
        this.context.lineCap = value
        return this
    }

    setLineJoin(value: CanvasLineJoin): this {
        this.context.lineJoin = value
        return this
    }

    setMiterLimit(value: number): this {
        this.context.miterLimit = value
        return this
    }

    setLineDash(segments: number[]): this {
        this.context.setLineDash(segments.map(s => s * this.pixelRatio))
        return this
    }

    setLineDashOffset(value: number): this {
        this.context.lineDashOffset = value * this.pixelRatio
        return this
    }

    // Global styles
    setGlobalAlpha(value: number): this {
        this.context.globalAlpha = value
        return this
    }

    setGlobalCompositeOperation(value: GlobalCompositeOperation): this {
        this.context.globalCompositeOperation = value
        return this
    }

    // Shadow styles
    setShadowBlur(value: number): this {
        this.context.shadowBlur = value * this.pixelRatio
        return this
    }

    setShadowColor(value: string): this {
        this.context.shadowColor = value
        return this
    }

    setShadowOffsetX(value: number): this {
        this.context.shadowOffsetX = value * this.pixelRatio
        return this
    }

    setShadowOffsetY(value: number): this {
        this.context.shadowOffsetY = value * this.pixelRatio
        return this
    }

    // Builder patterns for quick configuration
    withLineStyle(width: number, cap: CanvasLineCap = 'butt', join: CanvasLineJoin = 'miter'): this {
        return this
            .setLineWidth(width)
            .setLineCap(cap)
            .setLineJoin(join)
    }

    withShadow(blur: number, color: string, offsetX: number = 0, offsetY: number = 0): this {
        return this
            .setShadowBlur(blur)
            .setShadowColor(color)
            .setShadowOffsetX(offsetX)
            .setShadowOffsetY(offsetY)
    }

    clearShadow(): this {
        return this
            .setShadowBlur(0)
            .setShadowColor('transparent')
            .setShadowOffsetX(0)
            .setShadowOffsetY(0)
    }
}
