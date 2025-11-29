import Mesh from '../../core/Mesh'
import {
    RectGeometry as RectGeometryClass,
    CircleGeometry as CircleGeometryClass,
    EllipseGeometry as EllipseGeometryClass,
    PathGeometry as PathGeometryClass,
    PolylineGeometry as PolylineGeometryClass,
    SplineGeometry as SplineGeometryClass,
    TextGeometry as TextGeometryClass,
} from '../../geometries'
import {
    StrokeMaterial as StrokeMaterialClass,
    GradientMaterial as GradientMaterialClass,
    StrokeGradientMaterial as StrokeGradientMaterialClass,
    BasicMaterial as BasicMaterialClass,
    PatternMaterial as PatternMaterialClass,
} from '../../materials'

/**
 * Geometry and Material factory for Canvas JSX
 * Creates and updates geometries and materials from JSX elements
 *
 * Features:
 * - Factory pattern for creating geometries and materials
 * - Support for all canvas geometry types (Rect, Circle, Text, etc.)
 * - Support for all material types (Basic, Gradient, Pattern, etc.)
 * - Reactive property updates for existing instances
 * - Function component resolution
 *
 * @example
 * ```typescript
 * const manager = new GeometryMaterialManager()
 *
 * // Create geometry from JSX element
 * const geometry = manager.createGeometryOrMaterial({
 *   type: 'RectGeometry',
 *   props: { width: 100, height: 50 }
 * })
 *
 * // Update geometry properties
 * manager.updateGeometryOrMaterial(element, mesh)
 * ```
 */
export class GeometryMaterialManager {
    /**
     * Create geometry or material instance from JSX element
     * @param element JSX element with type and props
     * @returns Geometry or Material instance, or null if type not recognized
     */
    createGeometryOrMaterial(element: any): any {
        if (!Object.prototype.hasOwnProperty.call(element, 'props')) {
            throw new Error('Element must have props property')
        }

        let { type, props } = element

        // Handle function components
        if (typeof type === 'function' && !type.prototype) {
            const resolved = type(props)
            return this.createGeometryOrMaterial(resolved)
        }

        const typeName = typeof type === 'string' ? type : type?.name || 'unknown'

        switch (typeName) {
            // Geometries
            case 'RectGeometry':
                return new RectGeometryClass(props)
            case 'CircleGeometry':
                return new CircleGeometryClass(props)
            case 'EllipseGeometry':
                return new EllipseGeometryClass(props)
            case 'PathGeometry':
                return new PathGeometryClass()
            case 'PolylineGeometry':
                return new PolylineGeometryClass(props)
            case 'SplineGeometry':
                return new SplineGeometryClass(props)
            case 'TextGeometry':
                return new TextGeometryClass(props)

            // Materials
            case 'StrokeMaterial':
                return new StrokeMaterialClass(props)
            case 'GradientMaterial':
                return new GradientMaterialClass(props)
            case 'StrokeGradientMaterial':
                return new StrokeGradientMaterialClass(props)
            case 'BasicMaterial':
                return new BasicMaterialClass(props)
            case 'PatternMaterial':
                return new PatternMaterialClass(props)

            default:
                return null
        }
    }

    /**
     * Update geometry or material properties on existing mesh
     * Unwraps getter functions from props and applies changes
     * @param element JSX element with updated props
     * @param mesh Mesh instance to update
     */
    updateGeometryOrMaterial(element: any, mesh: Mesh): void {
        if (!Object.prototype.hasOwnProperty.call(element, 'props')) {
            throw new Error('Element must have props property')
        }

        let { type, props } = element

        // Handle function components
        if (typeof type === 'function' && !type.prototype) {
            const resolved = type(props)
            return this.updateGeometryOrMaterial(resolved, mesh)
        }

        const typeName = typeof type === 'string' ? type : type?.name || 'unknown'

        // Unwrap getters from props
        const unwrappedProps: any = {}
        for (const key in props) {
            unwrappedProps[key] = typeof props[key] === 'function' ? props[key]() : props[key]
        }

        switch (typeName) {
            case 'RectGeometry':
                if (mesh.geometry instanceof RectGeometryClass) {
                    if (unwrappedProps.width !== undefined) mesh.geometry.width = unwrappedProps.width
                    if (unwrappedProps.height !== undefined) mesh.geometry.height = unwrappedProps.height
                    if (unwrappedProps.x !== undefined) mesh.geometry.x = unwrappedProps.x
                    if (unwrappedProps.y !== undefined) mesh.geometry.y = unwrappedProps.y
                }
                break

            case 'TextGeometry':
                if (mesh.geometry instanceof TextGeometryClass) {
                    if (unwrappedProps.text !== undefined) mesh.geometry.text = unwrappedProps.text
                    if (unwrappedProps.x !== undefined) mesh.geometry.x = unwrappedProps.x
                    if (unwrappedProps.y !== undefined) mesh.geometry.y = unwrappedProps.y
                    if (unwrappedProps.font !== undefined) mesh.geometry.font = unwrappedProps.font
                    if (unwrappedProps.fontSize !== undefined) mesh.geometry.fontSize = unwrappedProps.fontSize
                    if (unwrappedProps.fontFamily !== undefined) mesh.geometry.fontFamily = unwrappedProps.fontFamily
                    if (unwrappedProps.fontWeight !== undefined) mesh.geometry.fontWeight = unwrappedProps.fontWeight
                    if (unwrappedProps.fontStyle !== undefined) mesh.geometry.fontStyle = unwrappedProps.fontStyle
                    if (unwrappedProps.textAlign !== undefined) mesh.geometry.textAlign = unwrappedProps.textAlign
                    if (unwrappedProps.textBaseline !== undefined) mesh.geometry.textBaseline = unwrappedProps.textBaseline
                    if (unwrappedProps.maxWidth !== undefined) mesh.geometry.maxWidth = unwrappedProps.maxWidth
                }
                break

            case 'CircleGeometry':
                if (mesh.geometry instanceof CircleGeometryClass) {
                    if (unwrappedProps.radius !== undefined) mesh.geometry.radius = unwrappedProps.radius
                    if (unwrappedProps.x !== undefined) mesh.geometry.x = unwrappedProps.x
                    if (unwrappedProps.y !== undefined) mesh.geometry.y = unwrappedProps.y
                    if (unwrappedProps.startAngle !== undefined) mesh.geometry.startAngle = unwrappedProps.startAngle
                    if (unwrappedProps.endAngle !== undefined) mesh.geometry.endAngle = unwrappedProps.endAngle
                    if (unwrappedProps.counterclockwise !== undefined) mesh.geometry.counterclockwise = unwrappedProps.counterclockwise
                }
                break

            case 'BasicMaterial':
                if (mesh.material instanceof BasicMaterialClass) {
                    if (unwrappedProps.color !== undefined) mesh.material.color = unwrappedProps.color
                    if (unwrappedProps.opacity !== undefined) mesh.material.opacity = unwrappedProps.opacity
                    if (unwrappedProps.lineWidth !== undefined) mesh.material.lineWidth = unwrappedProps.lineWidth
                    if (unwrappedProps.globalCompositeOperation !== undefined) {
                        mesh.material.globalCompositeOperation = unwrappedProps.globalCompositeOperation
                    }
                }
                break

            case 'PatternMaterial':
                if (mesh.material instanceof PatternMaterialClass) {
                    if (unwrappedProps.scale !== undefined) mesh.material.scale = unwrappedProps.scale
                    if (unwrappedProps.rotation !== undefined) mesh.material.rotation = unwrappedProps.rotation
                    if (unwrappedProps.offsetX !== undefined) mesh.material.offsetX = unwrappedProps.offsetX
                    if (unwrappedProps.offsetY !== undefined) mesh.material.offsetY = unwrappedProps.offsetY
                    if (unwrappedProps.opacity !== undefined) mesh.material.opacity = unwrappedProps.opacity
                    if (unwrappedProps.globalCompositeOperation !== undefined) {
                        mesh.material.globalCompositeOperation = unwrappedProps.globalCompositeOperation
                    }
                }
                break
        }
    }
}
