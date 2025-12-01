import Vector2 from '@sky-modules/math/Vector2'

import { RectGeometry, CircleGeometry } from '../geometries'

import Mesh from './Mesh'

/**
 * Ray for raycasting operations
 */
export interface Ray {
    /** Starting point of the ray */
    origin: Vector2
    /** Direction vector of the ray (normalized) */
    direction: Vector2
}

/**
 * Intersection result from raycasting
 */
export interface Intersection {
    /** Distance from ray origin to intersection point */
    distance: number
    /** World position of intersection */
    point: Vector2
    /** The mesh that was intersected */
    object: Mesh
}

/**
 * Raycasting utility for detecting intersections with objects
 *
 * Used for mouse picking, collision detection, and hit testing.
 * Supports rectangle and circle geometries.
 *
 * @example
 * ```typescript
 * const raycaster = new Raycaster()
 *
 * // Set ray from mouse position
 * raycaster.set(
 *   new Vector2(mouseX, mouseY),
 *   new Vector2(1, 0) // direction
 * )
 *
 * // Find intersections
 * const hits = raycaster.intersectObjects(scene.children, true)
 * if (hits.length > 0) {
 *   console.log('Hit:', hits[0].object.name)
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Mouse picking
 * canvas.addEventListener('click', (event) => {
 *   const rect = canvas.getBoundingClientRect()
 *   const x = event.clientX - rect.left
 *   const y = event.clientY - rect.top
 *
 *   raycaster.set(new Vector2(x, y), new Vector2(0, 0))
 *   const hits = raycaster.intersectObjects(meshes)
 *
 *   if (hits.length > 0) {
 *     hits[0].object.material.color = '#ff0000' // Highlight
 *   }
 * })
 * ```
 */
export default class Raycaster {
    static context = true

    /** The ray used for intersection tests */
    ray: Ray

    /**
     * Create a new raycaster
     *
     * @param origin - Starting point of the ray (default: 0,0)
     * @param direction - Direction of the ray (default: 0,0)
     */
    constructor(origin?: Vector2, direction?: Vector2) {
        this.ray = {
            origin: origin || new Vector2(),
            direction: direction || new Vector2(),
        }
    }

    /**
     * Set the ray's origin and direction
     *
     * @param origin - Starting point of the ray
     * @param direction - Direction of the ray (will be normalized)
     * @returns This raycaster for method chaining
     *
     * @example
     * ```typescript
     * raycaster.set(
     *   new Vector2(100, 100),
     *   new Vector2(1, 0)
     * )
     * ```
     */
    set(origin: Vector2, direction: Vector2): this {
        this.ray.origin.copy(origin)
        this.ray.direction.copy(direction).normalize()
        return this
    }

    /**
     * Set the ray from camera and screen coordinates
     *
     * @param coords - Screen coordinates to cast from
     * @param camera - Camera with position property
     * @returns This raycaster for method chaining
     *
     * @example
     * ```typescript
     * const camera = { position: new Vector2(400, 300) }
     * raycaster.setFromCamera(mousePos, camera)
     * ```
     */
    setFromCamera(coords: Vector2, camera: { position: Vector2 }): this {
        this.ray.origin.copy(camera.position)
        this.ray.direction.copy(coords).sub(camera.position).normalize()
        return this
    }

    /**
     * Check for intersections with an object and optionally its children
     *
     * @param object - The mesh to test intersection with
     * @param recursive - Whether to test children recursively (default: false)
     * @returns Array of intersections sorted by distance (closest first)
     *
     * @example
     * ```typescript
     * const hits = raycaster.intersectObject(mesh, true)
     * if (hits.length > 0) {
     *   console.log('Closest hit at:', hits[0].point)
     * }
     * ```
     */
    intersectObject(object: Mesh, recursive: boolean = false): Intersection[] {
        const intersections: Intersection[] = []

        if (!object.visible) return intersections

        // Check intersection with this object
        const intersection = this.intersectMesh(object)

        if (intersection) {
            intersections.push(intersection)
        }

        // Check children if recursive
        if (recursive) {
            for (const child of object.children) {
                if (child instanceof Mesh) {
                    intersections.push(...this.intersectObject(child, recursive))
                }
            }
        }

        return intersections.sort((a, b) => a.distance - b.distance)
    }

    /**
     * Check for intersections with multiple objects
     *
     * @param objects - Array of meshes to test
     * @param recursive - Whether to test children recursively (default: false)
     * @returns Array of all intersections sorted by distance (closest first)
     *
     * @example
     * ```typescript
     * const meshes = [mesh1, mesh2, mesh3]
     * const hits = raycaster.intersectObjects(meshes)
     * if (hits.length > 0) {
     *   console.log('Hit', hits[0].object.name, 'at distance', hits[0].distance)
     * }
     * ```
     */
    intersectObjects(objects: Mesh[], recursive: boolean = false): Intersection[] {
        const intersections: Intersection[] = []

        for (const object of objects) {
            intersections.push(...this.intersectObject(object, recursive))
        }

        return intersections.sort((a, b) => a.distance - b.distance)
    }

    private intersectMesh(mesh: Mesh): Intersection | null {
        const worldTransform = mesh.getWorldTransform()

        // Transform ray to local space
        const localOrigin = mesh.worldToLocal(this.ray.origin)
        const localDirection = this.ray.direction.clone()

        if (mesh.geometry instanceof RectGeometry) {
            return this.intersectRect(mesh, localOrigin, localDirection, worldTransform.position)
        } else if (mesh.geometry instanceof CircleGeometry) {
            return this.intersectCircle(mesh, localOrigin, localDirection, worldTransform.position)
        }

        return null
    }

    private intersectRect(
        mesh: Mesh,
        localOrigin: Vector2,
        localDirection: Vector2
    ): Intersection | null {
        const rect = mesh.geometry as RectGeometry
        const minX = rect.x
        const minY = rect.y
        const maxX = rect.x + rect.width
        const maxY = rect.y + rect.height

        // Ray-AABB intersection
        const invDirX = 1 / localDirection.x
        const invDirY = 1 / localDirection.y

        let t1 = (minX - localOrigin.x) * invDirX
        let t2 = (maxX - localOrigin.x) * invDirX
        let t3 = (minY - localOrigin.y) * invDirY
        let t4 = (maxY - localOrigin.y) * invDirY

        const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4))
        const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4))

        if (tmax < 0 || tmin > tmax) return null

        const t = tmin > 0 ? tmin : tmax
        if (t < 0) return null

        const point = localOrigin.clone().add(localDirection.clone().multiplyScalar(t))
        const worldPoint = mesh.localToWorld(point)
        const distance = worldPoint.distanceTo(this.ray.origin)

        return {
            distance,
            point: worldPoint,
            object: mesh,
        }
    }

    private intersectCircle(
        mesh: Mesh,
        localOrigin: Vector2,
        localDirection: Vector2
    ): Intersection | null {
        const circle = mesh.geometry as CircleGeometry
        const center = new Vector2(circle.x, circle.y)
        const radius = circle.radius

        // Ray-circle intersection
        const oc = localOrigin.clone().sub(center)
        const a = localDirection.dot(localDirection)
        const b = 2 * oc.dot(localDirection)
        const c = oc.dot(oc) - radius * radius

        const discriminant = b * b - 4 * a * c
        if (discriminant < 0) return null

        const sqrt = Math.sqrt(discriminant)
        const t1 = (-b - sqrt) / (2 * a)
        const t2 = (-b + sqrt) / (2 * a)

        const t = t1 > 0 ? t1 : t2
        if (t < 0) return null

        const point = localOrigin.clone().add(localDirection.clone().multiplyScalar(t))
        const worldPoint = mesh.localToWorld(point)
        const distance = worldPoint.distanceTo(this.ray.origin)

        return {
            distance,
            point: worldPoint,
            object: mesh,
        }
    }
}
