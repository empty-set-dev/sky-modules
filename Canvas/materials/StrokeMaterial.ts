import { Material, MaterialParameters } from './Material'

export class StrokeMaterial extends Material {
    constructor(parameters: MaterialParameters = {}) {
        super({
            color: '#000000', // StrokeMaterial должен быть черным по умолчанию
            ...parameters,
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
            lineDashOffset: this.lineDashOffset,
        })
    }
}
