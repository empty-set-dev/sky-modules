import { Geometry } from './Geometry'
import { Material } from './Material'
import Object2D from './Object2D'

export default class Mesh extends Object2D {
    static context = true

    readonly isMesh: boolean = true
    geometry: Geometry
    material: Material

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

        // Apply material properties
        this.material.apply(ctx, pixelRatio)

        // Begin path and draw geometry
        ctx.beginPath()
        this.geometry.draw(ctx, pixelRatio)

        // Render with material
        this.material.render(ctx)

        ctx.restore()

        // Render children
        for (const child of this.children) {
            if (child instanceof Mesh) {
                child.render(ctx, pixelRatio)
            }
        }
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
