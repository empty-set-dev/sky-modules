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
    static context = true

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
        ctx.globalAlpha = this.opacity
        ctx.lineWidth = this.lineWidth * pixelRatio
        ctx.lineCap = this.lineCap
        ctx.lineJoin = this.lineJoin
        ctx.setLineDash(this.lineDash.map(d => d * pixelRatio))
        ctx.lineDashOffset = this.lineDashOffset * pixelRatio
        ctx.shadowBlur = this.shadowBlur * pixelRatio
        ctx.shadowColor = this.shadowColor
        ctx.shadowOffsetX = this.shadowOffsetX * pixelRatio
        ctx.shadowOffsetY = this.shadowOffsetY * pixelRatio
        ctx.globalCompositeOperation = this.globalCompositeOperation
    }

    abstract render(ctx: CanvasRenderingContext2D): void
}

export class BasicMaterial extends Material {
    static context = true

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

export class StrokeMaterial extends Material {
    static context = true

    render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}

export class FillStrokeMaterial extends Material {
    static context = true

    strokeColor: string

    constructor(parameters: MaterialParameters & { strokeColor?: string } = {}) {
        super(parameters)
        this.strokeColor = parameters.strokeColor ?? this.color
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.strokeStyle = this.strokeColor
        ctx.stroke()
    }
}

export interface GradientMaterialParameters extends MaterialParameters {
    gradient: CanvasGradient
}

export class GradientMaterial extends Material {
    static context = true

    gradient: CanvasGradient

    constructor(parameters: GradientMaterialParameters) {
        super(parameters)
        this.gradient = parameters.gradient
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.gradient
        ctx.fill()
    }
}

export interface PatternMaterialParameters extends MaterialParameters {
    pattern: CanvasPattern
}

export class PatternMaterial extends Material {
    static context = true

    pattern: CanvasPattern

    constructor(parameters: PatternMaterialParameters) {
        super(parameters)
        this.pattern = parameters.pattern
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.pattern
        ctx.fill()
    }
}