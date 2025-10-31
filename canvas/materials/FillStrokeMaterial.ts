import { Material, MaterialParameters } from './Material'

export class FillStrokeMaterial extends Material {
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
            strokeColor: this.strokeColor,
        })
    }
}
