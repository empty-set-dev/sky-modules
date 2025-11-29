import { Geometry } from '../geometries/Geometry'
import { Material } from '../materials/Material'
import renderCSSToCanvas from '../rendering/renderCSSToCanvas'
import { TextGeometry } from '../geometries/TextGeometry'
import { parseUnit } from '../rendering/utils/parsing'

import Object2D from './Object2D'

import type { CSSProperties } from '../rendering/renderCSSToCanvas'

export default class Mesh extends Object2D {
    static context = true

    readonly isMesh: boolean = true
    geometry: Geometry
    material: Material

    // CSS properties for Box components
    _boxStyles?: CSSProperties
    _isBox?: boolean

    // Computed box dimensions (for hit testing and scrolling)
    _boxWidth?: number
    _boxHeight?: number
    _contentHeight?: number // Total height of content (for scroll limits)

    // Scroll state for overflow containers
    _scrollX: number = 0
    _scrollY: number = 0

    constructor(geometry: Geometry, material: Material) {
        super()
        this.geometry = geometry
        this.material = material
    }

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

            // For scrollable containers, don't pass children to renderCSSToCanvas
            // They will render via CanvasRenderer with scroll offset applied

            // Prepare children for layout rendering (only for non-scrollable containers)
            const children = !isScrollable
                ? this.children
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
                : []

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

    raycast(raycaster: any, intersects: any[]): void {
        // This method would be called by Raycaster
        // Implementation depends on geometry type
        const intersection = raycaster.intersectMesh?.(this)

        if (intersection) {
            intersects.push(intersection)
        }
    }

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
