import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {
        interface DrawRoundRectParameters {
            x: number
            y: number
            w: number
            h: number
            radius: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }
        function drawRoundedRect(
            ctx: CanvasRenderingContext2D,
            parameters: DrawRoundRectParameters
        ): void
        function drawTopRoundedRect(
            ctx: CanvasRenderingContext2D,
            parameters: Canvas.DrawRoundRectParameters
        ): void
        function drawBottomRoundedRect(
            ctx: CanvasRenderingContext2D,
            parameters: Canvas.DrawRoundRectParameters
        ): void

        interface DrawRectWithoutTopBorderParameters {
            x: number
            y: number
            w: number
            h: number
            color?: string
            strokeColor?: string
            strokeWidth?: number
        }
        function drawRectWithoutTopBorder(
            ctx: CanvasRenderingContext2D,
            parameters: Canvas.DrawRectWithoutTopBorderParameters
        ): void
    }
}

namespace CanvasLib {
    export function drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRoundRectParameters
    ): void {
        const { x, y, w, h, radius } = parameters

        ctx.save()

        ctx.beginPath()

        ctx.roundRect(
            x * ctx.pixelRatio,
            y * ctx.pixelRatio,
            w * ctx.pixelRatio,
            h * ctx.pixelRatio,
            radius
        )

        ctx.closePath()

        if (parameters.color) {
            ctx.fillStyle = parameters.color
            ctx.fill()
        }

        if (parameters.strokeColor && parameters.strokeWidth) {
            ctx.strokeStyle = parameters.strokeColor
            ctx.lineWidth = parameters.strokeWidth * ctx.pixelRatio
            ctx.stroke()
        }

        ctx.restore()
    }

    export function drawTopRoundedRect(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRoundRectParameters
    ): void {
        const { x, y, w, h, radius } = parameters

        ctx.save()

        ctx.beginPath()

        Canvas.moveTo(ctx, x, y + radius)
        Canvas.arcTo(ctx, x, y, x + radius, y, radius)
        Canvas.lineTo(ctx, x + w - radius, y)
        Canvas.arcTo(ctx, x + w, y, x + w, y + radius, radius)
        Canvas.lineTo(ctx, x + w, y + h)
        Canvas.lineTo(ctx, x, y + h)
        Canvas.lineTo(ctx, x, y + radius)

        ctx.closePath()

        if (parameters.color) {
            ctx.fillStyle = parameters.color
            ctx.fill()
        }

        if (parameters.strokeColor && parameters.strokeWidth) {
            ctx.strokeStyle = parameters.strokeColor
            ctx.lineWidth = parameters.strokeWidth * ctx.pixelRatio
            ctx.stroke()
        }

        ctx.restore()
    }

    export function drawBottomRoundedRect(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRoundRectParameters
    ): void {
        const { x, y, w, h, radius } = parameters

        ctx.save()

        ctx.beginPath()

        Canvas.moveTo(ctx, x, y)
        Canvas.lineTo(ctx, x + w, y)
        Canvas.lineTo(ctx, x + w, y + h - radius)
        Canvas.arcTo(ctx, x + w, y + h, x + w - radius, y + h, radius)
        Canvas.lineTo(ctx, x + w - radius, y + h)
        Canvas.arcTo(ctx, x, y + h, x, y + h - radius, radius)
        Canvas.lineTo(ctx, x, y)

        ctx.closePath()

        if (parameters.color) {
            ctx.fillStyle = parameters.color
            ctx.fill()
        }

        if (parameters.strokeColor && parameters.strokeWidth) {
            ctx.strokeStyle = parameters.strokeColor
            ctx.lineWidth = parameters.strokeWidth * ctx.pixelRatio
            ctx.stroke()
        }

        ctx.restore()
    }

    export function drawRectWithoutTopBorder(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRectWithoutTopBorderParameters
    ): void {
        const { x, y, w, h } = parameters

        ctx.save()

        ctx.beginPath()

        Canvas.moveTo(ctx, x, y)
        Canvas.lineTo(ctx, x, y + h)
        Canvas.lineTo(ctx, x + w, y + h)
        Canvas.lineTo(ctx, x + w, y)

        ctx.closePath()

        if (parameters.color) {
            ctx.fillStyle = parameters.color
            ctx.fill()
        }

        if (parameters.strokeColor && parameters.strokeWidth) {
            ctx.strokeStyle = parameters.strokeColor
            ctx.lineWidth = parameters.strokeWidth * ctx.pixelRatio
            ctx.stroke()
        }

        ctx.restore()
    }
}

globalify.namespace('Canvas', CanvasLib)
