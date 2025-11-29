import Mesh from './Mesh'
import Scene from './Scene'
import { PerformanceProfiler } from './utils/PerformanceProfiler'
import { ScrollbarRenderer } from './renderers/ScrollbarRenderer'
import { StyleManager } from './styles/StyleManager'

/**
 * Parameters for creating a CanvasRenderer instance
 */
export interface CanvasRendererParameters {
    /** Optional existing HTML canvas element. If not provided, a new one will be created */
    canvas?: HTMLCanvasElement
    /** Function that returns the canvas size as [width, height] */
    size(): [number, number]
    /** Optional pixel ratio for high-DPI displays. Defaults to window.devicePixelRatio */
    pixelRatio?: number
}

/**
 * High-level 2D canvas wrapper that provides a fluent API for drawing operations.
 * Automatically handles pixel ratio scaling for crisp rendering on high-DPI displays.
 *
 * @example
 * ```typescript
 * const renderer = new CanvasRenderer({
 *     size: () => [800, 600],
 *     pixelRatio: 2
 * })
 *
 * renderer
 *     .beginPath()
 *     .rect(10, 10, 100, 100)
 *     .setFillStyle('#ff0000')
 *     .fill()
 * ```
 */
class CanvasRenderer {
    /** Function that returns the current canvas size */
    size: () => [number, number]
    /** The HTML canvas element */
    readonly domElement: HTMLCanvasElement
    /** The 2D rendering context */
    readonly drawContext: CanvasRenderingContext2D
    /** The pixel ratio used for high-DPI scaling */
    readonly pixelRatio: number
    /** Performance profiler for tracking render timings */
    private readonly profiler: PerformanceProfiler
    /** Scrollbar renderer for scrollable containers */
    private readonly scrollbarRenderer: ScrollbarRenderer
    /** Style manager for canvas styling */
    private readonly styleManager: StyleManager

    /**
     * Creates a new CanvasRenderer instance
     * @param parameters Configuration options for the canvas
     * @throws {Error} If unable to get 2D rendering context
     */
    constructor(parameters: CanvasRendererParameters) {
        this.size = parameters.size
        this.domElement = parameters.canvas ?? document.createElement('canvas')
        const context = this.domElement.getContext('2d')

        if (!context) {
            throw new Error('CanvasRenderer: get domElement 2d context')
        }

        this.drawContext = context
        this.pixelRatio = parameters.pixelRatio ?? window.devicePixelRatio
        this.profiler = new PerformanceProfiler()
        this.scrollbarRenderer = new ScrollbarRenderer(context)
        this.styleManager = new StyleManager(context, this.pixelRatio)
        this.onResize()
    }

    drawHexagon(parameters: CanvasRenderer.DrawHexagonParameters): CanvasRenderer {
        this.drawContext.save()
        this.drawContext.beginPath()

        const angle = parameters.angle ?? 0
        const sides = parameters.sides ?? [0, 1, 2, 3, 4, 5]

        if (sides.length === 6) {
            for (let i = 0; i < 6; i++) {
                const x = Math.cos((i / 6 + angle / 360) * Math.PI * 2)
                const y = Math.sin((i / 6 + angle / 360) * Math.PI * 2)
                this.drawContext.lineTo(
                    (parameters.x + x * parameters.radius) * this.pixelRatio,
                    (parameters.y + y * parameters.radius) * this.pixelRatio
                )
            }
        } else {
            for (const side of sides) {
                const beginX = Math.cos(((side - 1) / 6 + angle / 360) * Math.PI * 2)
                const beginY = Math.sin(((side - 1) / 6 + angle / 360) * Math.PI * 2)
                const endX = Math.cos((side / 6 + angle / 360) * Math.PI * 2)
                const endY = Math.sin((side / 6 + angle / 360) * Math.PI * 2)

                this.drawContext.moveTo(
                    (parameters.x + beginX * parameters.radius) * this.pixelRatio,
                    (parameters.y + beginY * parameters.radius) * this.pixelRatio
                )
                this.drawContext.lineTo(
                    (parameters.x + endX * parameters.radius) * this.pixelRatio,
                    (parameters.y + endY * parameters.radius) * this.pixelRatio
                )
            }
        }

        this.drawContext.closePath()

        if (parameters.color) {
            this.drawContext.fillStyle = parameters.color
            this.drawContext.fill()
        }

        if (parameters.strokeColor && parameters.strokeWidth) {
            this.drawContext.strokeStyle = parameters.strokeColor
            this.drawContext.lineWidth = parameters.strokeWidth * this.pixelRatio
            this.drawContext.stroke()
        }

        this.drawContext.restore()
        return this
    }

    /**
     * Resizes the canvas to match the current size and applies scaling for high-DPI displays
     * @returns This canvas instance for method chaining
     */
    onResize(): this {
        const [w, h] = this.size()
        // Set internal canvas size (in physical pixels for high-DPI)
        this.domElement.width = w * this.pixelRatio
        this.domElement.height = h * this.pixelRatio
        // Set CSS size (in CSS pixels)
        this.domElement.style.width = `${w}px`
        this.domElement.style.height = `${h}px`
        return this
    }

    /**
     * Clears the entire canvas
     * @returns This canvas instance for method chaining
     */
    clear(): this {
        this.drawContext.clearRect(0, 0, this.domElement.width, this.domElement.height)
        return this
    }

    /**
     * Moves the drawing cursor to the specified point without drawing
     * @param x X coordinate
     * @param y Y coordinate
     * @returns This canvas instance for method chaining
     */
    moveTo(x: number, y: number): this {
        this.drawContext.moveTo(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    /**
     * Draws a line from the current position to the specified point
     * @param x X coordinate
     * @param y Y coordinate
     * @returns This canvas instance for method chaining
     */
    lineTo(x: number, y: number): this {
        this.drawContext.lineTo(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    /**
     * Draws an arc with control points and radius
     * @param x1 X coordinate of first control point
     * @param y1 Y coordinate of first control point
     * @param x2 X coordinate of second control point
     * @param y2 Y coordinate of second control point
     * @param radius Arc radius
     * @returns This canvas instance for method chaining
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this.drawContext.arcTo(
            x1 * this.pixelRatio,
            y1 * this.pixelRatio,
            x2 * this.pixelRatio,
            y2 * this.pixelRatio,
            radius * this.pixelRatio
        )
        return this
    }

    /**
     * Draws a circular arc
     * @param x X coordinate of arc center
     * @param y Y coordinate of arc center
     * @param radius Arc radius
     * @param startAngle Starting angle in radians
     * @param endAngle Ending angle in radians
     * @param counterclockwise Whether to draw counterclockwise
     * @returns This canvas instance for method chaining
     */
    arc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean
    ): this {
        this.drawContext.arc(
            x * this.pixelRatio,
            y * this.pixelRatio,
            radius * this.pixelRatio,
            startAngle,
            endAngle,
            counterclockwise
        )
        return this
    }

    /**
     * Draws a rectangle path
     * @param x X coordinate of top-left corner
     * @param y Y coordinate of top-left corner
     * @param width Rectangle width
     * @param height Rectangle height
     * @returns This canvas instance for method chaining
     */
    rect(x: number, y: number, width: number, height: number): this {
        this.drawContext.rect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    /**
     * Draws an elliptical arc
     * @param x X coordinate of ellipse center
     * @param y Y coordinate of ellipse center
     * @param radiusX Horizontal radius
     * @param radiusY Vertical radius
     * @param rotation Rotation angle in radians
     * @param startAngle Starting angle in radians
     * @param endAngle Ending angle in radians
     * @param counterclockwise Whether to draw counterclockwise
     * @returns This canvas instance for method chaining
     */
    ellipse(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        rotation: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean
    ): this {
        this.drawContext.ellipse(
            x * this.pixelRatio,
            y * this.pixelRatio,
            radiusX * this.pixelRatio,
            radiusY * this.pixelRatio,
            rotation,
            startAngle,
            endAngle,
            counterclockwise
        )
        return this
    }

    /**
     * Draws a cubic Bézier curve
     * @param cp1x X coordinate of first control point
     * @param cp1y Y coordinate of first control point
     * @param cp2x X coordinate of second control point
     * @param cp2y Y coordinate of second control point
     * @param x X coordinate of end point
     * @param y Y coordinate of end point
     * @returns This canvas instance for method chaining
     */
    bezierCurveTo(
        cp1x: number,
        cp1y: number,
        cp2x: number,
        cp2y: number,
        x: number,
        y: number
    ): this {
        this.drawContext.bezierCurveTo(
            cp1x * this.pixelRatio,
            cp1y * this.pixelRatio,
            cp2x * this.pixelRatio,
            cp2y * this.pixelRatio,
            x * this.pixelRatio,
            y * this.pixelRatio
        )
        return this
    }

    /**
     * Draws a quadratic Bézier curve
     * @param cpx X coordinate of control point
     * @param cpy Y coordinate of control point
     * @param x X coordinate of end point
     * @param y Y coordinate of end point
     * @returns This canvas instance for method chaining
     */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
        this.drawContext.quadraticCurveTo(
            cpx * this.pixelRatio,
            cpy * this.pixelRatio,
            x * this.pixelRatio,
            y * this.pixelRatio
        )
        return this
    }

    /**
     * Begins a new path by clearing the current path
     * @returns This canvas instance for method chaining
     */
    beginPath(): this {
        this.drawContext.beginPath()
        return this
    }

    /**
     * Closes the current path by drawing a line to the starting point
     * @returns This canvas instance for method chaining
     */
    closePath(): this {
        this.drawContext.closePath()
        return this
    }

    /**
     * Fills the current path with the current fill style
     * @returns This canvas instance for method chaining
     */
    fill(): this {
        this.drawContext.fill()
        return this
    }

    /**
     * Strokes the current path with the current stroke style
     * @returns This canvas instance for method chaining
     */
    stroke(): this {
        this.drawContext.stroke()
        return this
    }

    /**
     * Creates a clipping path from the current path
     * @returns This canvas instance for method chaining
     */
    clip(): this {
        this.drawContext.clip()
        return this
    }

    /**
     * Saves the current drawing state (transformations, styles, etc.)
     * @returns This canvas instance for method chaining
     */
    save(): this {
        this.drawContext.save()
        return this
    }

    /**
     * Restores the most recently saved drawing state
     * @returns This canvas instance for method chaining
     */
    restore(): this {
        this.drawContext.restore()
        return this
    }

    /**
     * Scales the coordinate system
     * @param x Horizontal scaling factor
     * @param y Vertical scaling factor
     * @returns This canvas instance for method chaining
     */
    scale(x: number, y: number): this {
        this.drawContext.scale(x, y)
        return this
    }

    /**
     * Rotates the coordinate system
     * @param angle Rotation angle in radians
     * @returns This canvas instance for method chaining
     */
    rotate(angle: number): this {
        this.drawContext.rotate(angle)
        return this
    }

    /**
     * Translates the coordinate system
     * @param x Horizontal translation distance
     * @param y Vertical translation distance
     * @returns This canvas instance for method chaining
     */
    translate(x: number, y: number): this {
        this.drawContext.translate(x * this.pixelRatio, y * this.pixelRatio)
        return this
    }

    /**
     * Applies a transformation matrix to the coordinate system
     * @param a Horizontal scaling
     * @param b Vertical skewing
     * @param c Horizontal skewing
     * @param d Vertical scaling
     * @param e Horizontal translation
     * @param f Vertical translation
     * @returns This canvas instance for method chaining
     */
    transform(a: number, b: number, c: number, d: number, e: number, f: number): this {
        this.drawContext.transform(a, b, c, d, e * this.pixelRatio, f * this.pixelRatio)
        return this
    }

    /**
     * Sets the transformation matrix, replacing the current transformation
     * @param a Horizontal scaling
     * @param b Vertical skewing
     * @param c Horizontal skewing
     * @param d Vertical scaling
     * @param e Horizontal translation
     * @param f Vertical translation
     * @returns This canvas instance for method chaining
     */
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): this {
        this.drawContext.setTransform(a, b, c, d, e * this.pixelRatio, f * this.pixelRatio)
        return this
    }

    /**
     * Resets the transformation matrix to the identity matrix
     * @returns This canvas instance for method chaining
     */
    resetTransform(): this {
        this.drawContext.resetTransform()
        return this
    }

    /**
     * Fills text at the specified position
     * @param text Text to draw
     * @param x X coordinate
     * @param y Y coordinate
     * @param maxWidth Optional maximum width for text
     * @returns This canvas instance for method chaining
     */
    fillText(text: string, x: number, y: number, maxWidth?: number): this {
        this.drawContext.fillText(
            text,
            x * this.pixelRatio,
            y * this.pixelRatio,
            maxWidth ? maxWidth * this.pixelRatio : undefined
        )
        return this
    }

    /**
     * Strokes text at the specified position
     * @param text Text to draw
     * @param x X coordinate
     * @param y Y coordinate
     * @param maxWidth Optional maximum width for text
     * @returns This canvas instance for method chaining
     */
    strokeText(text: string, x: number, y: number, maxWidth?: number): this {
        this.drawContext.strokeText(
            text,
            x * this.pixelRatio,
            y * this.pixelRatio,
            maxWidth ? maxWidth * this.pixelRatio : undefined
        )
        return this
    }

    /**
     * Fills a rectangle directly without affecting the current path
     * @param x X coordinate of top-left corner
     * @param y Y coordinate of top-left corner
     * @param width Rectangle width
     * @param height Rectangle height
     * @returns This canvas instance for method chaining
     */
    fillRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.fillRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    /**
     * Strokes a rectangle directly without affecting the current path
     * @param x X coordinate of top-left corner
     * @param y Y coordinate of top-left corner
     * @param width Rectangle width
     * @param height Rectangle height
     * @returns This canvas instance for method chaining
     */
    strokeRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.strokeRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    /**
     * Clears a rectangular area, making it transparent
     * @param x X coordinate of top-left corner
     * @param y Y coordinate of top-left corner
     * @param width Rectangle width
     * @param height Rectangle height
     * @returns This canvas instance for method chaining
     */
    clearRect(x: number, y: number, width: number, height: number): this {
        this.drawContext.clearRect(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio
        )
        return this
    }

    /**
     * Sets the fill style for shapes
     * @param style Color, gradient, or pattern
     * @returns This canvas instance for method chaining
     */
    setFillStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.styleManager.setFillStyle(style)
        return this
    }

    /**
     * Sets the stroke style for lines
     * @param style Color, gradient, or pattern
     * @returns This canvas instance for method chaining
     */
    setStrokeStyle(style: string | CanvasGradient | CanvasPattern): this {
        this.styleManager.setStrokeStyle(style)
        return this
    }

    /**
     * Sets the line width for strokes
     * @param width Line width
     * @returns This canvas instance for method chaining
     */
    setLineWidth(width: number): this {
        this.styleManager.setLineWidth(width)
        return this
    }

    /**
     * Sets the line cap style
     * @param cap Line cap style ('butt', 'round', 'square')
     * @returns This canvas instance for method chaining
     */
    setLineCap(cap: CanvasLineCap): this {
        this.styleManager.setLineCap(cap)
        return this
    }

    /**
     * Sets the line join style
     * @param join Line join style ('miter', 'round', 'bevel')
     * @returns This canvas instance for method chaining
     */
    setLineJoin(join: CanvasLineJoin): this {
        this.styleManager.setLineJoin(join)
        return this
    }

    /**
     * Sets the miter limit for line joins
     * @param limit Miter limit value
     * @returns This canvas instance for method chaining
     */
    setMiterLimit(limit: number): this {
        this.styleManager.setMiterLimit(limit)
        return this
    }

    /**
     * Sets the line dash pattern
     * @param segments Array of dash and gap lengths
     * @returns This canvas instance for method chaining
     */
    setLineDash(segments: number[]): this {
        this.styleManager.setLineDash(segments)
        return this
    }

    /**
     * Sets the line dash offset
     * @param offset Dash offset value
     * @returns This canvas instance for method chaining
     */
    setLineDashOffset(offset: number): this {
        this.styleManager.setLineDashOffset(offset)
        return this
    }

    /**
     * Sets the font for text rendering
     * @param font CSS font specification
     * @returns This canvas instance for method chaining
     */
    setFont(font: string): this {
        this.drawContext.font = font
        return this
    }

    /**
     * Sets the text alignment
     * @param align Text alignment ('start', 'end', 'left', 'right', 'center')
     * @returns This canvas instance for method chaining
     */
    setTextAlign(align: CanvasTextAlign): this {
        this.drawContext.textAlign = align
        return this
    }

    /**
     * Sets the text baseline
     * @param baseline Text baseline ('top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom')
     * @returns This canvas instance for method chaining
     */
    setTextBaseline(baseline: CanvasTextBaseline): this {
        this.drawContext.textBaseline = baseline
        return this
    }

    /**
     * Sets the global alpha (opacity) for all drawing operations
     * @param alpha Alpha value between 0 (transparent) and 1 (opaque)
     * @returns This canvas instance for method chaining
     */
    setGlobalAlpha(alpha: number): this {
        this.styleManager.setGlobalAlpha(alpha)
        return this
    }

    /**
     * Sets the global composite operation for blending modes
     * @param operation Composite operation type
     * @returns This canvas instance for method chaining
     */
    setGlobalCompositeOperation(operation: GlobalCompositeOperation): this {
        this.styleManager.setGlobalCompositeOperation(operation)
        return this
    }

    /**
     * Sets the shadow blur radius
     * @param blur Blur radius for shadows
     * @returns This canvas instance for method chaining
     */
    setShadowBlur(blur: number): this {
        this.styleManager.setShadowBlur(blur)
        return this
    }

    /**
     * Sets the shadow color
     * @param color Shadow color
     * @returns This canvas instance for method chaining
     */
    setShadowColor(color: string): this {
        this.styleManager.setShadowColor(color)
        return this
    }

    /**
     * Sets the horizontal shadow offset
     * @param offset Horizontal shadow offset
     * @returns This canvas instance for method chaining
     */
    setShadowOffsetX(offset: number): this {
        this.styleManager.setShadowOffsetX(offset)
        return this
    }

    /**
     * Sets the vertical shadow offset
     * @param offset Vertical shadow offset
     * @returns This canvas instance for method chaining
     */
    setShadowOffsetY(offset: number): this {
        this.styleManager.setShadowOffsetY(offset)
        return this
    }

    /**
     * Measures the width of text with current font settings
     * @param text Text to measure
     * @returns TextMetrics object with measurement data
     */
    measureText(text: string): TextMetrics {
        return this.drawContext.measureText(text)
    }

    /**
     * Renders a scene to the canvas
     * @param scene Scene object containing meshes and other objects to render
     * @returns This canvas instance for method chaining
     */
    render(scene: Scene): this {
        const t0 = performance.now()
        this.clear()
        const t1 = performance.now()

        // Reset all canvas state to prevent accumulation across frames
        this.drawContext.resetTransform()
        this.drawContext.globalAlpha = 1
        this.drawContext.globalCompositeOperation = 'source-over'
        this.drawContext.setLineDash([])
        this.drawContext.lineDashOffset = 0
        this.drawContext.shadowBlur = 0
        this.drawContext.shadowColor = 'transparent'
        this.drawContext.shadowOffsetX = 0
        this.drawContext.shadowOffsetY = 0
        const t2 = performance.now()

        if (scene.background) {
            this.drawContext.fillStyle = scene.background
            this.drawContext.fillRect(0, 0, this.domElement.width, this.domElement.height)
        }
        const t3 = performance.now()

        // Update matrices before rendering
        scene.updateMatrixWorld()
        const t4 = performance.now()

        this.renderObject(scene)
        const t5 = performance.now()

        // Record performance timing
        this.profiler.recordTiming({
            clear: t1 - t0,
            reset: t2 - t1,
            background: t3 - t2,
            updateMatrix: t4 - t3,
            renderObjects: t5 - t4,
        })

        // Log stats if interval has passed
        this.profiler.logStats(t5)

        return this
    }

    /**
     * Recursively renders an object and its children
     * @param object Object to render (Scene or Mesh)
     */
    private renderObject(object: Scene | Mesh): void {
        if (!object.visible) return

        if (object instanceof Mesh) {
            object.render(this.drawContext, this.pixelRatio)

            // Apply scroll offset if this is a scrollable container
            const isScrollable = object._isBox && object._boxStyles &&
                (object._boxStyles.overflow === 'auto' || object._boxStyles.overflow === 'scroll')

            if (isScrollable) {
                this.drawContext.save()
                this.drawContext.translate(
                    -object._scrollX * this.pixelRatio,
                    -object._scrollY * this.pixelRatio
                )
            }

            // Render children after parent
            for (const child of object.children) {
                this.renderObject(child as Mesh)
            }

            if (isScrollable) {
                this.drawContext.restore()

                // Draw scrollbar using ScrollbarRenderer
                const transform = object.getWorldTransform()
                this.scrollbarRenderer.render({
                    object,
                    x: transform.position.x * this.pixelRatio,
                    y: transform.position.y * this.pixelRatio,
                    pixelRatio: this.pixelRatio,
                })
            }
        } else {
            // Render all children for Scene
            for (const child of object.children) {
                this.renderObject(child as Mesh)
            }
        }
    }

    /**
     * Disposes of the canvas and cleans up resources
     * Currently a placeholder for future cleanup logic
     */
    dispose(): void {
        // Canvas cleanup if needed
        // For now, just a placeholder method
    }
}

namespace CanvasRenderer {
    export interface DrawHexagonParameters {
        x: number
        y: number
        sides?: number[]
        radius: number
        angle?: number
        color?: string
        strokeColor?: string
        strokeWidth?: number
    }
}

export default CanvasRenderer
