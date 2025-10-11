import { Geometry } from './Geometry'

export class CircleGeometry extends Geometry {
    constructor(
        public radius: number = 1,
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

    clone(): CircleGeometry {
        return new CircleGeometry(
            this.radius,
            this.x,
            this.y,
            this.startAngle,
            this.endAngle,
            this.counterclockwise
        )
    }
}