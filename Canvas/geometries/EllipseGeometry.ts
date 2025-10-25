import { Geometry } from './Geometry'

export interface EllipseGeometryProps {
    radiusX?: number
    radiusY?: number
    x?: number
    y?: number
    rotation?: number
    startAngle?: number
    endAngle?: number
    counterclockwise?: boolean
}

export class EllipseGeometry extends Geometry {
    public radiusX: number
    public radiusY: number
    public x: number
    public y: number
    public rotation: number
    public startAngle: number
    public endAngle: number
    public counterclockwise: boolean

    constructor(props: EllipseGeometryProps = {}) {
        super()
        this.radiusX = props.radiusX ?? 1
        this.radiusY = props.radiusY ?? 0.5
        this.x = props.x ?? 0
        this.y = props.y ?? 0
        this.rotation = props.rotation ?? 0
        this.startAngle = props.startAngle ?? 0
        this.endAngle = props.endAngle ?? Math.PI * 2
        this.counterclockwise = props.counterclockwise ?? false
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
        return new EllipseGeometry({
            radiusX: this.radiusX,
            radiusY: this.radiusY,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            counterclockwise: this.counterclockwise,
        })
    }
}
