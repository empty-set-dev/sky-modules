import { Material, MaterialParameters } from './Material'

export class BasicMaterial extends Material {
    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.color
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Check if we have text data from TextGeometry
        const textData = (ctx as any)._textData

        if (textData) {
            ctx.fillText(textData.text, textData.x, textData.y, textData.maxWidth)
            // Clean up after rendering
            delete (ctx as any)._textData
        } else {
            ctx.fill()
        }
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
            globalCompositeOperation: this.globalCompositeOperation,
        })
    }
}
