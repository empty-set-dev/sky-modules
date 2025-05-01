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
    }
}

namespace CanvasLib {
    export function moveTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.moveTo(x * ctx.devicePixelRatio, y * ctx.devicePixelRatio)
    }
    export function lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.lineTo(x * ctx.devicePixelRatio, y * ctx.devicePixelRatio)
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
            x1 * ctx.devicePixelRatio,
            y1 * ctx.devicePixelRatio,
            x2 * ctx.devicePixelRatio,
            y2 * ctx.devicePixelRatio,
            radius * ctx.devicePixelRatio
        )
    }
}

globalify.namespace('Canvas', CanvasLib)
