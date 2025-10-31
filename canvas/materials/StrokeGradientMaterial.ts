import { Material, MaterialParameters } from './Material'

export interface StrokeGradientMaterialParameters extends MaterialParameters {
    gradient: CanvasGradient
}

export class StrokeGradientMaterial extends Material {
    gradient: CanvasGradient

    constructor(parameters: StrokeGradientMaterialParameters) {
        super(parameters)
        this.gradient = parameters.gradient
    }

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.strokeStyle = this.gradient
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.stroke()
    }

    clone(): StrokeGradientMaterial {
        return new StrokeGradientMaterial({
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
            globalCompositeOperation: this.globalCompositeOperation,
        })
    }
}
