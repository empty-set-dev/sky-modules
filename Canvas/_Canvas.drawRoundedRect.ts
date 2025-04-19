import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {
        interface DrawParameters {
            color: string
            strokeColor: string
            strokeWidth: number
        }

        interface DrawRoundRectParameters extends DrawParameters {
            x: number
            y: number
            w: number
            h: number
            radius: number
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

        interface DrawRectWithoutTopBorderParameters extends DrawParameters {
            x: number
            y: number
            w: number
            h: number
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

        ctx.roundRect(x, y, w, h, radius)

        ctx.closePath()

        ctx.fillStyle = parameters.color
        ctx.fill()
        ctx.strokeStyle = parameters.strokeColor
        ctx.lineWidth = parameters.strokeWidth
        ctx.stroke()

        ctx.restore()
    }

    export function drawTopRoundedRect(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRoundRectParameters
    ): void {
        const { x, y, w, h, radius } = parameters

        ctx.save()

        ctx.beginPath()

        ctx.moveTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius)
        ctx.lineTo(x + w - radius, y)
        ctx.arcTo(x + w, y, x + w, y + radius, radius)
        ctx.lineTo(x + w, y + h)
        ctx.lineTo(x, y + h)
        ctx.lineTo(x, y + radius)

        ctx.closePath()

        ctx.fillStyle = parameters.color
        ctx.fill()
        ctx.strokeStyle = parameters.strokeColor
        ctx.lineWidth = parameters.strokeWidth
        ctx.stroke()

        ctx.restore()
    }

    export function drawBottomRoundedRect(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRoundRectParameters
    ): void {
        const { x, y, w, h, radius } = parameters

        ctx.save()

        ctx.beginPath()

        ctx.moveTo(x, y)
        ctx.lineTo(x + w, y)
        ctx.lineTo(x + w, y + h - radius)
        ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
        ctx.lineTo(x + w - radius, y + h)
        ctx.arcTo(x, y + h, x, y + h - radius, radius)
        ctx.lineTo(x, y)

        ctx.closePath()

        ctx.fillStyle = parameters.color
        ctx.fill()
        ctx.strokeStyle = parameters.strokeColor
        ctx.lineWidth = parameters.strokeWidth
        ctx.stroke()

        ctx.restore()
    }

    export function drawRectWithoutTopBorder(
        ctx: CanvasRenderingContext2D,
        parameters: Canvas.DrawRectWithoutTopBorderParameters
    ): void {
        const { x, y, w, h } = parameters

        ctx.save()

        ctx.beginPath()

        ctx.moveTo(x, y)
        ctx.lineTo(x, y + h)
        ctx.lineTo(x + w, y + h)
        ctx.lineTo(x + w, y)

        ctx.closePath()

        ctx.fillStyle = parameters.color
        ctx.fill()
        ctx.strokeStyle = parameters.strokeColor
        ctx.lineWidth = parameters.strokeWidth
        ctx.stroke()

        ctx.restore()
    }
}

globalify.namespace('Canvas', CanvasLib)
