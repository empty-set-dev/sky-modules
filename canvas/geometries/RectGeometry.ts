import { Geometry } from './Geometry'

/**
 * Properties for rectangle geometry
 */
export interface RectGeometryProps {
    /** Rectangle width */
    width?: number
    /** Rectangle height */
    height?: number
    /** X offset from origin (default: 0) */
    x?: number
    /** Y offset from origin (default: 0) */
    y?: number
}

/**
 * Rectangular shape geometry
 *
 * Creates rectangles and squares. Commonly used for boxes, buttons,
 * and background shapes.
 *
 * @example
 * ```typescript
 * // Basic rectangle
 * const rect = new RectGeometry({ width: 100, height: 50 })
 *
 * // Centered rectangle (negative offset)
 * const centered = new RectGeometry({
 *   width: 100,
 *   height: 50,
 *   x: -50,  // Half width
 *   y: -25   // Half height
 * })
 * ```
 *
 * @example
 * ```typescript
 * // With mesh
 * const mesh = new Mesh(
 *   new RectGeometry({ width: 200, height: 100 }),
 *   new BasicMaterial({ color: '#ff0000' })
 * )
 * ```
 */
export class RectGeometry extends Geometry {
    /** Rectangle width */
    public width: number
    /** Rectangle height */
    public height: number
    /** X offset from origin */
    public x: number
    /** Y offset from origin */
    public y: number

    /**
     * Create a new rectangle geometry
     *
     * @param props - Rectangle properties
     */
    constructor(props: RectGeometryProps = {}) {
        super()
        this.width = props.width ?? 1
        this.height = props.height ?? 1
        this.x = props.x ?? 0
        this.y = props.y ?? 0
    }

    /**
     * Draw the rectangle to the canvas context
     *
     * @param ctx - Canvas 2D context
     * @param pixelRatio - Device pixel ratio for scaling
     */
    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        ctx.rect(
            this.x * pixelRatio,
            this.y * pixelRatio,
            this.width * pixelRatio,
            this.height * pixelRatio
        )
    }

    /**
     * Create a copy of this geometry
     *
     * @returns Cloned rectangle geometry
     */
    clone(): RectGeometry {
        return new RectGeometry({ width: this.width, height: this.height, x: this.x, y: this.y })
    }
}
