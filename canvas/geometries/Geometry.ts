/**
 * Abstract base class for all geometry shapes
 *
 * Geometries define the shape to be drawn on the canvas. They implement the
 * draw method which adds paths to the canvas context. Geometries are always
 * used in combination with Materials in a Mesh for rendering.
 *
 * All coordinates are automatically scaled by pixelRatio for high-DPI displays.
 *
 * @example
 * ```typescript
 * class CustomGeometry extends Geometry {
 *   constructor(public size: number) {
 *     super()
 *   }
 *
 *   draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
 *     const s = this.size * pixelRatio
 *     ctx.moveTo(0, 0)
 *     ctx.lineTo(s, 0)
 *     ctx.lineTo(s / 2, s)
 *     ctx.closePath()
 *   }
 * }
 * ```
 */
export abstract class Geometry {
    /**
     * Draw this geometry to the canvas context
     *
     * Should add paths to the context but NOT call fill() or stroke().
     * Those operations are handled by the Material.
     *
     * @param ctx - Canvas 2D context to draw to
     * @param pixelRatio - Device pixel ratio for scaling
     */
    abstract draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void
}
