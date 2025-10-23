import { Geometry } from './Geometry'

export class EllipseGeometry extends Geometry {
    constructor(
        public radiusX: number = 1,
        public radiusY: number = 0.5,
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

    clone(): EllipseGeometry {
        return new EllipseGeometry(
            this.radiusX,
            this.radiusY,
            this.x,
            this.y,
            this.rotation,
            this.startAngle,
            this.endAngle,
            this.counterclockwise
        )
    }
}
