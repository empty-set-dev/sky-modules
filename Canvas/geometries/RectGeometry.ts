import { Geometry } from './Geometry'

export interface RectGeometryProps {
    width?: number
    height?: number
    x?: number
    y?: number
}

export class RectGeometry extends Geometry {
    public width: number
    public height: number
    public x: number
    public y: number

    constructor(props: RectGeometryProps = {}) {
        super()
        this.width = props.width ?? 1
        this.height = props.height ?? 1
        this.x = props.x ?? 0
        this.y = props.y ?? 0
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
        return new RectGeometry({ width: this.width, height: this.height, x: this.x, y: this.y })
    }
}
