import { Geometry } from './Geometry'

export class RectGeometry extends Geometry {
    constructor(
        public width: number = 1,
        public height: number = 1,
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

    clone(): RectGeometry {
        return new RectGeometry(this.width, this.height, this.x, this.y)
    }
}
