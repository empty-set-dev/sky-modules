import { Geometry } from './Geometry'

export interface CircleGeometryProps {
    radius?: number
    x?: number
    y?: number
    startAngle?: number
    endAngle?: number
    counterclockwise?: boolean
}

export class CircleGeometry extends Geometry {
    public radius: number
    public x: number
    public y: number
    public startAngle: number
    public endAngle: number
    public counterclockwise: boolean

    constructor(props: CircleGeometryProps = {}) {
        super()
        this.radius = props.radius ?? 1
        this.x = props.x ?? 0
        this.y = props.y ?? 0
        this.startAngle = props.startAngle ?? 0
        this.endAngle = props.endAngle ?? Math.PI * 2
        this.counterclockwise = props.counterclockwise ?? false
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
        return new CircleGeometry({
            radius: this.radius,
            x: this.x,
            y: this.y,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            counterclockwise: this.counterclockwise,
        })
    }
}
