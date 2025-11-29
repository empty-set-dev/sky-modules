import { Material, MaterialParameters } from './Material'
import { wrapText } from '../rendering/wrapText'

export class BasicMaterial extends Material {
    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)
        ctx.fillStyle = this.color
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Check if we have text data from TextGeometry
        const textData = (ctx as any)._textData

        if (textData) {
            // Use text wrapping if maxWidth is specified
            if (textData.maxWidth) {
                const lines = wrapText({
                    text: textData.text,
                    maxWidth: textData.maxWidth,
                    ctx,
                    wordWrap: 'normal',
                })

                // Get line height from current font
                const fontSize = parseFloat(ctx.font) || 16
                const lineHeight = fontSize * 1.2 // Default line height multiplier

                // Render each line
                lines.forEach((line, index) => {
                    const lineY = textData.y + index * lineHeight
                    ctx.fillText(line, textData.x, lineY)
                })
            } else {
                // No maxWidth, render as single line
                ctx.fillText(textData.text, textData.x, textData.y)
            }

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
