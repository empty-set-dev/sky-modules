export interface MaterialParameters {
    color?: string
    opacity?: number
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    shadowBlur?: number
    shadowColor?: string
    shadowOffsetX?: number
    shadowOffsetY?: number
    globalCompositeOperation?: GlobalCompositeOperation
}

export abstract class Material {
    color: string
    opacity: number
    lineWidth: number
    lineCap: CanvasLineCap
    lineJoin: CanvasLineJoin
    lineDash: number[]
    lineDashOffset: number
    shadowBlur: number
    shadowColor: string
    shadowOffsetX: number
    shadowOffsetY: number
    globalCompositeOperation: GlobalCompositeOperation

    constructor(parameters: MaterialParameters = {}) {
        this.color = parameters.color ?? '#ffffff'
        this.opacity = parameters.opacity ?? 1
        this.lineWidth = parameters.lineWidth ?? 1
        this.lineCap = parameters.lineCap ?? 'butt'
        this.lineJoin = parameters.lineJoin ?? 'miter'
        this.lineDash = parameters.lineDash ?? []
        this.lineDashOffset = parameters.lineDashOffset ?? 0
        this.shadowBlur = parameters.shadowBlur ?? 0
        this.shadowColor = parameters.shadowColor ?? 'transparent'
        this.shadowOffsetX = parameters.shadowOffsetX ?? 0
        this.shadowOffsetY = parameters.shadowOffsetY ?? 0
        this.globalCompositeOperation = parameters.globalCompositeOperation ?? 'source-over'
    }

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        // Only set properties if they differ from defaults to reduce canvas context operations
        if (this.opacity !== 1) {
            ctx.globalAlpha = this.opacity
        }

        if (this.lineWidth !== 1) {
            ctx.lineWidth = this.lineWidth * pixelRatio
        }

        if (this.lineCap !== 'butt') {
            ctx.lineCap = this.lineCap
        }

        if (this.lineJoin !== 'miter') {
            ctx.lineJoin = this.lineJoin
        }

        // Only call setLineDash if there are dashes to set
        if (this.lineDash.length > 0) {
            ctx.setLineDash(this.lineDash.map(d => d * pixelRatio))
        }

        if (this.lineDashOffset !== 0) {
            ctx.lineDashOffset = this.lineDashOffset * pixelRatio
        }

        // Only set shadow properties if shadow is actually used
        if (this.shadowBlur !== 0) {
            ctx.shadowBlur = this.shadowBlur * pixelRatio
            ctx.shadowColor = this.shadowColor
            ctx.shadowOffsetX = this.shadowOffsetX * pixelRatio
            ctx.shadowOffsetY = this.shadowOffsetY * pixelRatio
        }

        if (this.globalCompositeOperation !== 'source-over') {
            ctx.globalCompositeOperation = this.globalCompositeOperation
        }
    }

    abstract render(ctx: CanvasRenderingContext2D): void
}
