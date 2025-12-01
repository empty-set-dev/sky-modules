import { Geometry } from '../geometries/Geometry'
import { Material } from '../materials/Material'
import renderCSSToCanvas from '../rendering/renderCSSToCanvas'
import { TextGeometry } from '../geometries/TextGeometry'
import { parseUnit } from '../rendering/utils/parsing'
import { parseSpacing } from '../jsx/box/styles-parser'
import { calculateFlexLayout } from '../rendering/utils/layout'

import Object2D from './Object2D'

import type { CSSProperties } from '../rendering/renderCSSToCanvas'

/**
 * Renderable object combining geometry and material
 *
 * Mesh is the primary drawable entity in the scene graph. It combines a Geometry
 * (what to draw) with a Material (how to draw) and can be positioned, rotated,
 * and scaled in the scene.
 *
 * Also supports CSS-based Box rendering with flexbox layouts for complex UI.
 *
 * @example
 * ```typescript
 * // Standard mesh with geometry and material
 * const mesh = new Mesh(
 *   new RectGeometry({ width: 100, height: 50 }),
 *   new BasicMaterial({ color: '#ff0000' })
 * )
 * mesh.setPosition(200, 100)
 * scene.add(mesh)
 * ```
 *
 * @example
 * ```typescript
 * // Box component with CSS styles
 * const box = new Mesh(geometry, material)
 * box._isBox = true
 * box._boxStyles = {
 *   width: '200px',
 *   height: '100px',
 *   background: '#333',
 *   border: '2px solid white',
 *   padding: '10px'
 * }
 * ```
 */
export default class Mesh extends Object2D {
    static context = true

    /** Type identifier - always true for Mesh instances */
    readonly isMesh: boolean = true

    /** The geometry defining the shape to draw */
    geometry: Geometry

    /** The material defining how to draw the shape */
    material: Material

    // CSS properties for Box components
    /** CSS styles for Box component rendering */
    _boxStyles?: CSSProperties
    /** Flag indicating if this is a Box component */
    _isBox?: boolean

    // Computed box dimensions (for hit testing and scrolling)
    /** Computed width of the box (including padding/border) */
    _boxWidth?: number
    /** Computed height of the box (including padding/border) */
    _boxHeight?: number
    /** Total height of content (for scroll limits) */
    _contentHeight?: number

    // Scroll state for overflow containers
    /** Horizontal scroll offset */
    _scrollX: number = 0
    /** Vertical scroll offset */
    _scrollY: number = 0

    /**
     * Create a new mesh
     *
     * @param geometry - The geometry defining the shape
     * @param material - The material defining the drawing style
     *
     * @example
     * ```typescript
     * const mesh = new Mesh(
     *   new CircleGeometry({ radius: 50 }),
     *   new BasicMaterial({ color: '#00ff00' })
     * )
     * ```
     */
    constructor(geometry: Geometry, material: Material) {
        super()
        this.geometry = geometry
        this.material = material
    }

    /**
     * Render this mesh to the canvas
     *
     * Handles two rendering modes:
     * 1. Standard mesh: Applies material, draws geometry, renders with material
     * 2. Box component: Uses renderCSSToCanvas for CSS-like rendering with flexbox
     *
     * @param ctx - Canvas 2D context to render to
     * @param pixelRatio - Device pixel ratio for high-DPI displays
     *
     * @internal This method is called by CanvasRenderer
     */
    render(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        if (!this.visible) return

        const transform = this.getWorldTransform()

        ctx.save()

        // Apply transformations
        ctx.translate(transform.position.x * pixelRatio, transform.position.y * pixelRatio)

        if (transform.rotation !== 0) {
            ctx.rotate(transform.rotation)
        }

        if (transform.scale.x !== 1 || transform.scale.y !== 1) {
            ctx.scale(transform.scale.x, transform.scale.y)
        }

        // If this is a Box component with CSS styles, use renderCSSToCanvas
        if (this._isBox && this._boxStyles) {
            // Compute box dimensions (same logic as in renderCSSToCanvas)
            // Use canvas size as fallback for boxes without explicit width/height
            this._boxWidth = parseUnit(
                this._boxStyles.width || ctx.canvas.width / pixelRatio
            )
            this._boxHeight = parseUnit(
                this._boxStyles.height || ctx.canvas.height / pixelRatio
            )

            // Calculate content height for scrollable containers
            const overflow = this._boxStyles.overflow || this._boxStyles.overflowY
            const isScrollable = overflow === 'auto' || overflow === 'scroll'

            if (isScrollable) {
                // Sum up heights of all Box children + gaps
                const gap = parseUnit(this._boxStyles.gap || 0)
                let contentHeight = 0

                const boxChildren = this.children.filter(
                    child => child instanceof Mesh && child._isBox && child._boxHeight
                )

                for (let i = 0; i < boxChildren.length; i++) {
                    const child = boxChildren[i] as Mesh
                    contentHeight += child._boxHeight || 0
                    if (i < boxChildren.length - 1) {
                        contentHeight += gap
                    }
                }

                // Add padding
                const paddingTop = parseUnit(this._boxStyles.paddingTop || this._boxStyles.padding || 0)
                const paddingBottom = parseUnit(this._boxStyles.paddingBottom || this._boxStyles.padding || 0)
                contentHeight += paddingTop + paddingBottom

                this._contentHeight = contentHeight
            }

            // Extract text content from children (text is stored in child Mesh with TextGeometry)
            const textChild = this.children.find(
                child => child instanceof Mesh && child.geometry instanceof TextGeometry
            )
            const text = textChild ? (textChild.geometry as TextGeometry).text : undefined

            // Hide text children so they don't render twice
            // (once via renderCSSToCanvas, once via standard rendering)
            this.children.forEach(child => {
                if (child instanceof Mesh && child.geometry instanceof TextGeometry) {
                    child.visible = false
                }
            })

            // For scrollable containers, calculate layout positions and update child transforms
            // For non-scrollable containers, pass children to renderCSSToCanvas for layout+render
            let children: any[] = []

            if (isScrollable) {
                // Calculate layout positions but don't pass to renderCSSToCanvas
                // Children will be rendered by CanvasRenderer with scroll offset
                const boxChildren = this.children.filter(
                    child => child instanceof Mesh && child._isBox && child._boxStyles
                )

                if (boxChildren.length > 0) {
                    // Parse padding
                    const padding = parseSpacing(this._boxStyles.padding || '0')

                    // Create parsed box for layout calculation
                    const parsedBox = {
                        x: 0,
                        y: 0,
                        width: this._boxWidth! - padding.left - padding.right,
                        height: this._boxHeight! - padding.top - padding.bottom,
                        padding: padding,
                    }

                    // Prepare child elements for layout calculation
                    const childElements = boxChildren.map(child => {
                        const meshChild = child as Mesh
                        return {
                            css: meshChild._boxStyles!,
                            options: { box: true, fill: true, pixelRatio },
                        }
                    })

                    // Calculate flex layout positions
                    const positions = calculateFlexLayout(this._boxStyles, parsedBox, childElements)

                    // Update child transforms with calculated positions
                    for (let i = 0; i < boxChildren.length; i++) {
                        const child = boxChildren[i] as Mesh
                        const pos = positions[i]
                        child.position.x = pos.x
                        child.position.y = pos.y
                    }
                }
            } else {
                // For non-scrollable containers, pass children to renderCSSToCanvas
                children = this.children
                    .filter(child => child instanceof Mesh && child._isBox && child._boxStyles)
                    .map(child => {
                        const meshChild = child as Mesh
                        return {
                            css: meshChild._boxStyles!,
                            options: {
                                box: true,
                                fill: true,
                                pixelRatio, // Pass pixelRatio to children
                            },
                        }
                    })
            }

            // Render using CSS renderer with flexbox/grid layout support
            renderCSSToCanvas(ctx, this._boxStyles, {
                x: 0, // Position is already applied via transform
                y: 0,
                box: true,
                fill: true,
                stroke: false, // Don't stroke text, border is handled by drawBorder
                children: children.length > 0 ? children : undefined,
                text, // Pass text content for rendering
                pixelRatio, // Pass pixelRatio for high-DPI displays
            })
        } else {
            // Standard mesh rendering
            // Apply material properties
            this.material.apply(ctx, pixelRatio)

            // Begin path and draw geometry
            ctx.beginPath()
            this.geometry.draw(ctx, pixelRatio)

            // Render with material
            this.material.render(ctx)
        }

        ctx.restore()

        // DON'T render children here - CanvasRenderer.renderObject() already does this!
        // Double rendering of children causes exponential growth in render calls
        // If Scene → Mesh1 → Mesh2, without this fix Mesh2 would render 2x, Mesh3 would render 4x, etc.
    }

    /**
     * Test for ray intersection with this mesh
     *
     * Called by Raycaster to determine if a ray intersects this mesh.
     * Implementation depends on geometry type.
     *
     * @param raycaster - The raycaster performing the test
     * @param intersects - Array to store intersection results
     *
     * @internal This method is called by Raycaster
     */
    raycast(raycaster: any, intersects: any[]): void {
        // This method would be called by Raycaster
        // Implementation depends on geometry type
        const intersection = raycaster.intersectMesh?.(this)

        if (intersection) {
            intersects.push(intersection)
        }
    }

    /**
     * Create a shallow copy of this mesh
     *
     * Clones transform properties but shares geometry and material instances.
     * Use this for creating multiple instances of the same visual object.
     *
     * @returns Cloned mesh with copied transform properties
     *
     * @example
     * ```typescript
     * const original = new Mesh(geometry, material)
     * const copy = original.clone()
     * copy.setPosition(100, 100) // Different position, same geometry/material
     * ```
     */
    clone(): Mesh {
        const cloned = new Mesh(this.geometry, this.material)
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        if (this.id != null) cloned.id = this.id
        if (this.name != null) cloned.name = this.name
        return cloned
    }
}
