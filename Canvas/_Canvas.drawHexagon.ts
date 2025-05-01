import globalify from "sky/utilities/globalify"

declare global {
    namespace Canvas {
        interface DrawHexParameters extends CanvasLib.DrawHexParameters {}
        function drawHexagon(
            ctx: CanvasRenderingContext2D,
            parameters: DrawHexParameters,
        ): void
    }
}

namespace CanvasLib {
    export interface DrawHexParameters {
        x: number
        y: number
        sides?: number[]
        radius: number
        angle?: number
        color?: string
        strokeColor?: string
        strokeWidth?: number
    }
    export function drawHexagon(
        ctx: CanvasRenderingContext2D,
        parameters: DrawHexParameters
    ): void {
        ctx.save()
    
        ctx.beginPath()
    
        const angle = parameters.angle ?? 0
        
        const sides = parameters.sides ?? [0, 1, 2, 3, 4, 5]

        if (sides.length === 6) {
            for (let i = 0; i < 6; i++) {
                const x = Math.cos((i / 6 + angle / 360) * Math.PI * 2)
                const y = Math.sin((i / 6 + angle / 360) * Math.PI * 2)
                ctx.lineTo(parameters.x + x * parameters.radius, parameters.y + y * parameters.radius)
            }
        } else {
            sides.forEach(side => {
                const beginX = Math.cos(((side - 1) / 6 + angle / 360) * Math.PI * 2)
                const beginY = Math.sin(((side - 1) / 6 + angle / 360) * Math.PI * 2)
                const endX = Math.cos((side / 6 + angle / 360) * Math.PI * 2)
                const endY = Math.sin((side / 6 + angle / 360) * Math.PI * 2)
                ctx.moveTo(parameters.x + beginX * parameters.radius, parameters.y + beginY * parameters.radius)
                ctx.lineTo(parameters.x + endX * parameters.radius, parameters.y + endY * parameters.radius)
            })
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
}

globalify.namespace('Canvas', CanvasLib)
