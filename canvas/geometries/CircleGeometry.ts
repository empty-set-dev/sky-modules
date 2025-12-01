import { Geometry } from './Geometry'

/**
 * Properties for circle geometry
 */
export interface CircleGeometryProps {
    /** Circle radius */
    radius?: number
    /** X offset from origin (default: 0) */
    x?: number
    /** Y offset from origin (default: 0) */
    y?: number
    /** Start angle in radians (default: 0) */
    startAngle?: number
    /** End angle in radians (default: 2π) */
    endAngle?: number
    /** Draw direction (default: false = clockwise) */
    counterclockwise?: boolean
}

/**
 * Circle and arc geometry
 *
 * Creates circles, arcs, and pie shapes. Supports partial circles
 * through start and end angles.
 *
 * @example
 * ```typescript
 * // Full circle
 * const circle = new CircleGeometry({ radius: 50 })
 *
 * // Half circle (arc)
 * const arc = new CircleGeometry({
 *   radius: 50,
 *   startAngle: 0,
 *   endAngle: Math.PI
 * })
 *
 * // Pac-Man
 * const pacman = new CircleGeometry({
 *   radius: 50,
 *   startAngle: Math.PI * 0.25,
 *   endAngle: Math.PI * 1.75
 * })
 * ```
 *
 * @example
 * ```typescript
 * // With mesh
 * const mesh = new Mesh(
 *   new CircleGeometry({ radius: 30 }),
 *   new BasicMaterial({ color: '#00ff00' })
 * )
 * ```
 */
export class CircleGeometry extends Geometry {
    /** Circle radius */
    public radius: number
    /** X offset from origin */
    public x: number
    /** Y offset from origin */
    public y: number
    /** Start angle in radians */
    public startAngle: number
    /** End angle in radians */
    public endAngle: number
    /** Draw direction (false = clockwise, true = counterclockwise) */
    public counterclockwise: boolean

    /**
     * Create a new circle geometry
     *
     * @param props - Circle properties
     */
    constructor(props: CircleGeometryProps = {}) {
        super()
        this.radius = props.radius ?? 1
        this.x = props.x ?? 0
        this.y = props.y ?? 0
        this.startAngle = props.startAngle ?? 0
        this.endAngle = props.endAngle ?? Math.PI * 2
        this.counterclockwise = props.counterclockwise ?? false
    }

    /**
     * Draw the circle to the canvas context
     *
     * @param ctx - Canvas 2D context
     * @param pixelRatio - Device pixel ratio for scaling
     */
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

    /**
     * Create a copy of this geometry
     *
     * @returns Cloned circle geometry
     */
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
