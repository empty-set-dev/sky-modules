import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {
        interface DrawTextParameters {
            x: number
            y: number
            text: string
            maxWidth?: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }

        function drawText(
            ctx: CanvasRenderingContext2D,
            parameters: DrawTextParameters
        ): void
    }
}

namespace CanvasLib {
    export function drawText(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawTextParameters
    ): void {
        const { x, y, text, maxWidth } = parameters

        ctx.save()
        ctx.beginPath()
        ctx.fillText(text, x, y, maxWidth)
        ctx.closePath()
    
        if (parameters.color) {
            ctx.fillStyle = parameters.color
            ctx.fill()
        }
    
        if (parameters.strokeColor && parameters.strokeWidth) {
            ctx.strokeStyle = parameters.strokeColor
            ctx.lineWidth = parameters.strokeWidth
            ctx.stroke()
        }

        ctx.restore()
    }
}

globalify.namespace('Canvas', CanvasLib)
