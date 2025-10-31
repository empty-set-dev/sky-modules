import { Material, MaterialParameters } from './Material'

export interface PatternMaterialParameters extends MaterialParameters {
    pattern: CanvasPattern
}

export class PatternMaterial extends Material {
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
            globalCompositeOperation: this.globalCompositeOperation,
        })
    }
}
