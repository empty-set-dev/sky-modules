import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {
        function moveTo(ctx: CanvasRenderingContext2D, x: number, y: number): void
        function lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void
        function arcTo(
            ctx: CanvasRenderingContext2D,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            radius: number
        ): void

        type Visibility = 'visible' | 'hidden'
    }
}

namespace CanvasLib {
    export function moveTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.moveTo(x * ctx.pixelRatio, y * ctx.pixelRatio)
    }
    export function lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.lineTo(x * ctx.pixelRatio, y * ctx.pixelRatio)
    }
    export function arcTo(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        radius: number
    ): void {
        ctx.arcTo(
            x1 * ctx.pixelRatio,
            y1 * ctx.pixelRatio,
            x2 * ctx.pixelRatio,
            y2 * ctx.pixelRatio,
            radius * ctx.pixelRatio
        )
    }
}

globalify.namespace('Canvas', CanvasLib)
