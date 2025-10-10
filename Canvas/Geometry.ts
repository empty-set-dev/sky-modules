export abstract class Geometry {
    static context = true

    abstract draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void
}

export class RectGeometry extends Geometry {
    static context = true

    constructor(
        public width: number,
        public height: number,
        public x: number = 0,
        public y: number = 0
    ) {
        super()
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        ctx.rect(
            this.x * pixelRatio,
            this.y * pixelRatio,
            this.width * pixelRatio,
            this.height * pixelRatio
        )
    }
}

export class CircleGeometry extends Geometry {
    static context = true

    constructor(
        public radius: number,
        public x: number = 0,
        public y: number = 0,
        public startAngle: number = 0,
        public endAngle: number = Math.PI * 2,
        public counterclockwise: boolean = false
    ) {
        super()
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        ctx.arc(
            this.x * pixelRatio,
            this.y * pixelRatio,
            this.radius * pixelRatio,
            this.startAngle,
            this.endAngle,
            this.counterclockwise
        )
    }
}

export class EllipseGeometry extends Geometry {
    static context = true

    constructor(
        public radiusX: number,
        public radiusY: number,
        public x: number = 0,
        public y: number = 0,
        public rotation: number = 0,
        public startAngle: number = 0,
        public endAngle: number = Math.PI * 2,
        public counterclockwise: boolean = false
    ) {
        super()
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        ctx.ellipse(
            this.x * pixelRatio,
            this.y * pixelRatio,
            this.radiusX * pixelRatio,
            this.radiusY * pixelRatio,
            this.rotation,
            this.startAngle,
            this.endAngle,
            this.counterclockwise
        )
    }
}

export class PathGeometry extends Geometry {
    static context = true

    private commands: Array<{
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
}
