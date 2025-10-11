import { Geometry } from './Geometry'

export class PathGeometry extends Geometry {
    commands: Array<{
        type:
            | 'moveTo'
            | 'lineTo'
            | 'bezierCurveTo'
            | 'quadraticCurveTo'
            | 'arcTo'
            | 'arc'
            | 'closePath'
        args: number[]
    }> = []

    moveTo(x: number, y: number): this {
        this.commands.push({ type: 'moveTo', args: [x, y] })
        return this
    }

    lineTo(x: number, y: number): this {
        this.commands.push({ type: 'lineTo', args: [x, y] })
        return this
    }

    bezierCurveTo(
        cp1x: number,
        cp1y: number,
        cp2x: number,
        cp2y: number,
        x: number,
        y: number
    ): this {
        this.commands.push({ type: 'bezierCurveTo', args: [cp1x, cp1y, cp2x, cp2y, x, y] })
        return this
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
        this.commands.push({ type: 'quadraticCurveTo', args: [cpx, cpy, x, y] })
        return this
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this.commands.push({ type: 'arcTo', args: [x1, y1, x2, y2, radius] })
        return this
    }

    arc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean
    ): this {
        this.commands.push({
            type: 'arc',
            args: [x, y, radius, startAngle, endAngle, counterclockwise ? 1 : 0],
        })
        return this
    }

    closePath(): this {
        this.commands.push({ type: 'closePath', args: [] })
        return this
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        for (const command of this.commands) {
            const { type, args } = command

            switch (type) {
                case 'moveTo':
                    ctx.moveTo(args[0] * pixelRatio, args[1] * pixelRatio)
                    break
                case 'lineTo':
                    ctx.lineTo(args[0] * pixelRatio, args[1] * pixelRatio)
                    break
                case 'bezierCurveTo':
                    ctx.bezierCurveTo(
                        args[0] * pixelRatio,
                        args[1] * pixelRatio,
                        args[2] * pixelRatio,
                        args[3] * pixelRatio,
                        args[4] * pixelRatio,
                        args[5] * pixelRatio
                    )
                    break
                case 'quadraticCurveTo':
                    ctx.quadraticCurveTo(
                        args[0] * pixelRatio,
                        args[1] * pixelRatio,
                        args[2] * pixelRatio,
                        args[3] * pixelRatio
                    )
                    break
                case 'arcTo':
                    ctx.arcTo(
                        args[0] * pixelRatio,
                        args[1] * pixelRatio,
                        args[2] * pixelRatio,
                        args[3] * pixelRatio,
                        args[4] * pixelRatio
                    )
                    break
                case 'arc':
                    ctx.arc(
                        args[0] * pixelRatio,
                        args[1] * pixelRatio,
                        args[2] * pixelRatio,
                        args[3],
                        args[4],
                        Boolean(args[5])
                    )
                    break
                case 'closePath':
                    ctx.closePath()
                    break
            }
        }
    }

    clone(): PathGeometry {
        const cloned = new PathGeometry()
        cloned.commands = [...this.commands]
        return cloned
    }
}