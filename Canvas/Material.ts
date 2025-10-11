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

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.color
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fill()
    }

    clone(): BasicMaterial {
        return new BasicMaterial({
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            globalCompositeOperation: this.globalCompositeOperation
        })
    }
}

export class StrokeMaterial extends Material {
    static context = true

    constructor(parameters: MaterialParameters = {}) {
        super({
            color: '#000000', // StrokeMaterial должен быть черным по умолчанию
            ...parameters
        })
    }

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.strokeStyle = this.color
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.stroke()
    }

    clone(): StrokeMaterial {
        return new StrokeMaterial({
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset
        })
    }
}

export class FillStrokeMaterial extends Material {
    static context = true

    strokeColor: string

    constructor(parameters: MaterialParameters & { strokeColor?: string } = {}) {
        super(parameters)
        this.strokeColor = parameters.strokeColor ?? this.color
    }

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.strokeColor
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fill()
        ctx.stroke()
    }

    clone(): FillStrokeMaterial {
        return new FillStrokeMaterial({
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            globalCompositeOperation: this.globalCompositeOperation,
            strokeColor: this.strokeColor
        })
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

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.gradient
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fill()
    }

    clone(): GradientMaterial {
        return new GradientMaterial({
            gradient: this.gradient,
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            globalCompositeOperation: this.globalCompositeOperation
        })
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

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.pattern
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fill()
    }

    clone(): PatternMaterial {
        return new PatternMaterial({
            pattern: this.pattern,
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            globalCompositeOperation: this.globalCompositeOperation
        })
    }
}
