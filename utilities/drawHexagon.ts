export interface DrawHexParameters {
    x: number
    y: number
    radius: number
    angle?: number
    color?: string
    strokeColor?: string
    strokeWidth?: number
}
export default function drawHexagon(
    ctx: CanvasRenderingContext2D,
    parameters: DrawHexParameters
): void {
    ctx.save()

    ctx.beginPath()

    const angle = parameters.angle ?? 0

    for (let i = 0; i < 6; ++i) {
        const x = Math.cos((i / 6 + angle / 360) * Math.PI * 2)
        const y = Math.sin((i / 6 + angle / 360) * Math.PI * 2)
        ctx.lineTo(parameters.x + x * parameters.radius, parameters.y + y * parameters.radius)
    }

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
