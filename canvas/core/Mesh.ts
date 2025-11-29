import { Geometry } from '../geometries/Geometry'
import { Material } from '../materials/Material'
import renderCSSToCanvas from '../rendering/renderCSSToCanvas'
import { TextGeometry } from '../geometries/TextGeometry'

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
            // Extract text content from children (text is stored in child Mesh with TextGeometry)
            const textChild = this.children.find(
                child => child instanceof Mesh && child.geometry instanceof TextGeometry
            )
            const text = textChild ? (textChild.geometry as TextGeometry).text : undefined

            // Prepare children for layout rendering
            const children = this.children
                .filter(child => child instanceof Mesh && child._isBox && child._boxStyles)
                .map(child => {
                    const meshChild = child as Mesh
                    return {
                        css: meshChild._boxStyles!,
                        options: {
                            box: true,
                            fill: true,
                        },
                    }
                })

            // Render using CSS renderer with flexbox/grid layout support
            renderCSSToCanvas(ctx, this._boxStyles, {
                x: 0, // Position is already applied via transform
                y: 0,
                box: true,
                fill: true,
                stroke:
                    this._boxStyles.border !== undefined ||
                    this._boxStyles.borderWidth !== undefined,
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
