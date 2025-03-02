export {}

declare global {
    namespace Canvas {
        interface DrawRoundRectParams {
            x: number
            y: number
            w: number
            h: number
            radius: number
            color: string
            opacity: number
            strokeColor: string
            strokeWidth: number
        }
        function drawRoundedRect(ctx: CanvasRenderingContext2D, params: DrawRoundRectParams): void
    }
}

namespace lib {
    export function drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        params: Canvas.DrawRoundRectParams
    ): void {
        const { x, y, w, h, radius } = params

        ctx.beginPath()
        ctx.fillStyle = params.color
        ctx.roundRect(x + params.strokeWidth, y + params.strokeWidth, w, h, radius)
        ctx.fill()
        ctx.fillStyle = params.strokeColor
        ctx.lineWidth = params.strokeWidth
        ctx.stroke()
    }
}

Object.assign(Canvas, lib)
