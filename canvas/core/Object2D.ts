import { Matrix3 } from '@sky-modules/math/three/Matrix3'
import { Quaternion } from '@sky-modules/math/three/Quaternion'
import Vector2 from '@sky-modules/math/Vector2'

/**
 * 2D transform interface containing position, rotation, and scale
 */
export interface Transform2D {
    /** Position in 2D space */
    position: Vector2
    /** Rotation in radians */
    rotation: number
    /** Scale factors for X and Y axes */
    scale: Vector2
}

/**
 * Base class for all objects in the 2D scene graph
 *
 * Provides transform properties (position, rotation, scale), hierarchy management,
 * and world transform calculations. Similar to Three.js Object3D but optimized for 2D.
 *
 * @example
 * ```typescript
 * const obj = new Object2D()
 * obj
 *   .setPosition(100, 50)
 *   .setRotation(Math.PI / 4)
 *   .setScale(2, 2)
 *
 * // Hierarchy
 * parent.add(child)
 *
 * // World transforms
 * const worldPos = obj.getWorldPosition()
 * ```
 */
export default class Object2D {
    static context = true

    position: Vector2 = new Vector2(0, 0)
    rotation: number = 0
    scale: Vector2 = new Vector2(1, 1)
    visible: boolean = true
    children: Object2D[] = []
    parent: Object2D | null = null
    id?: string
    name?: string

    // Matrix properties like Three.js
    matrix: Matrix3 = new Matrix3()
    matrixWorld: Matrix3 = new Matrix3()
    matrixAutoUpdate: boolean = true
    matrixWorldNeedsUpdate: boolean = true

    // Quaternion support (for 2D rotation around Z-axis)
    quaternion: Quaternion = new Quaternion()
    useQuaternion: boolean = false

    // Cached world transform to avoid creating new objects every frame
    private _cachedWorldTransform: Transform2D = {
        position: new Vector2(),
        rotation: 0,
        scale: new Vector2(1, 1),
    }
    private _worldTransformNeedsUpdate: boolean = true

    /**
     * Add a child object to this object
     *
     * If the child already has a parent, it will be removed from that parent first.
     *
     * @param object - The object to add as a child
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * parent.add(child1)
     * parent.add(child2)
     * ```
     */
    add(object: Object2D): this {
        if (object.parent) {
            object.parent.remove(object)
        }

        object.parent = this
        this.children.push(object)
        return this
    }

    /**
     * Remove a child object from this object
     *
     * @param object - The object to remove
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * parent.remove(child)
     * ```
     */
    remove(object: Object2D): this {
        const index = this.children.indexOf(object)

        if (index !== -1) {
            this.children.splice(index, 1)
            object.parent = null
        }

        return this
    }

    /**
     * Set the position of this object in local space
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.setPosition(100, 200)
     * ```
     */
    setPosition(x: number, y: number): this {
        this.position.set(x, y)
        return this
    }

    /**
     * Set the rotation of this object around the Z axis
     *
     * @param rotation - Rotation angle in radians
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.setRotation(Math.PI / 4) // 45 degrees
     * ```
     */
    setRotation(rotation: number): this {
        this.rotation = rotation
        return this
    }

    /**
     * Set the scale of this object
     *
     * @param x - Scale factor for X axis
     * @param y - Scale factor for Y axis
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.setScale(2, 2) // Double size
     * ```
     */
    setScale(x: number, y: number): this {
        this.scale.set(x, y)
        return this
    }

    /**
     * Set the visibility of this object
     *
     * Invisible objects and their children are not rendered.
     *
     * @param visible - Whether the object should be visible
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.setVisible(false) // Hide object
     * ```
     */
    setVisible(visible: boolean): this {
        this.visible = visible
        return this
    }

    /**
     * Get the world transform of this object
     *
     * Returns the accumulated transform from the root to this object,
     * including all parent transforms. Uses caching for performance.
     *
     * @returns The world transform containing position, rotation, and scale
     *
     * @example
     * ```typescript
     * const transform = obj.getWorldTransform()
     * console.log(transform.position) // World position
     * ```
     */
    getWorldTransform(): Transform2D {
        // Return cached transform if it's still valid
        if (!this._worldTransformNeedsUpdate && !this.matrixWorldNeedsUpdate) {
            return this._cachedWorldTransform
        }

        // Reuse cached objects instead of creating new ones
        this._cachedWorldTransform.position.copy(this.position)
        this._cachedWorldTransform.rotation = this.rotation
        this._cachedWorldTransform.scale.copy(this.scale)

        if (this.parent) {
            const parentTransform = this.parent.getWorldTransform()

            // Apply parent scale
            this._cachedWorldTransform.position.multiply(parentTransform.scale)
            this._cachedWorldTransform.scale.multiply(parentTransform.scale)

            // Apply parent rotation (reuse temp vector instead of creating new one)
            const cos = Math.cos(parentTransform.rotation)
            const sin = Math.sin(parentTransform.rotation)
            const px = this._cachedWorldTransform.position.x
            const py = this._cachedWorldTransform.position.y
            this._cachedWorldTransform.position.x = px * cos - py * sin
            this._cachedWorldTransform.position.y = px * sin + py * cos
            this._cachedWorldTransform.rotation += parentTransform.rotation

            // Apply parent position
            this._cachedWorldTransform.position.add(parentTransform.position)
        }

        this._worldTransformNeedsUpdate = false
        return this._cachedWorldTransform
    }

    /**
     * Execute a callback for this object and all its descendants
     *
     * Traverses the entire subtree in depth-first order.
     *
     * @param callback - Function to call for each object
     *
     * @example
     * ```typescript
     * scene.traverse(obj => {
     *   console.log(obj.name)
     * })
     * ```
     */
    traverse(callback: (object: Object2D) => void): void {
        callback(this)

        for (const child of this.children) {
            child.traverse(callback)
        }
    }

    // Matrix methods like Three.js
    updateMatrix(): this {
        // Compose 2D transformation matrix manually
        this.matrix.identity()
        this.matrix.translate(this.position.x, this.position.y)
        this.matrix.rotate(this.rotation)
        this.matrix.scale(this.scale.x, this.scale.y)
        this.matrixWorldNeedsUpdate = true
        this._worldTransformNeedsUpdate = true
        return this
    }

    updateMatrixWorld(force: boolean = false): this {
        if (this.matrixAutoUpdate) this.updateMatrix()

        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix)
            } else {
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
            }

            this.matrixWorldNeedsUpdate = false
            this._worldTransformNeedsUpdate = true
            force = true
        }

        // Update children
        for (const child of this.children) {
            child.updateMatrixWorld(force)
        }

        return this
    }

    applyMatrix3(matrix: Matrix3): this {
        this.matrix.premultiply(matrix)
        // Extract transformation from matrix (simplified for 2D)
        const elements = this.matrix.elements
        this.position.set(elements[6], elements[7])
        this.scale.set(
            Math.sqrt(elements[0] * elements[0] + elements[1] * elements[1]),
            Math.sqrt(elements[3] * elements[3] + elements[4] * elements[4])
        )
        this.rotation = Math.atan2(elements[1], elements[0])
        return this
    }

    /**
     * Move this object along the X axis
     *
     * @param distance - Distance to move
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.translateX(10) // Move 10 pixels right
     * ```
     */
    translateX(distance: number): this {
        this.position.x += distance
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    /**
     * Move this object along the Y axis
     *
     * @param distance - Distance to move
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.translateY(10) // Move 10 pixels down
     * ```
     */
    translateY(distance: number): this {
        this.position.y += distance
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    /**
     * Rotate this object around the Z axis
     *
     * @param angle - Angle to rotate in radians
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.rotateZ(Math.PI / 4) // Rotate 45 degrees
     * ```
     */
    rotateZ(angle: number): this {
        this.rotation += angle
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    /**
     * Point this object towards a position
     *
     * @param x - X coordinate to look at
     * @param y - Y coordinate to look at
     * @returns This object for method chaining
     *
     * @example
     * ```typescript
     * obj.lookAt(mouseX, mouseY) // Point towards mouse
     * ```
     */
    lookAt(x: number, y: number): this {
        const angle = Math.atan2(y - this.position.y, x - this.position.x)
        this.rotation = angle
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    /**
     * Get the position of this object in world space
     *
     * @returns World position vector
     */
    getWorldPosition(): Vector2 {
        return this.getWorldTransform().position
    }

    /**
     * Get the rotation of this object in world space
     *
     * @returns World rotation in radians
     */
    getWorldRotation(): number {
        return this.getWorldTransform().rotation
    }

    /**
     * Get the scale of this object in world space
     *
     * @returns World scale vector
     */
    getWorldScale(): Vector2 {
        return this.getWorldTransform().scale
    }

    /**
     * Convert a point from local space to world space
     *
     * @param localPoint - Point in local coordinates
     * @returns Point in world coordinates
     *
     * @example
     * ```typescript
     * const localPoint = new Vector2(10, 0)
     * const worldPoint = obj.localToWorld(localPoint)
     * ```
     */
    localToWorld(localPoint: Vector2): Vector2 {
        const transform = this.getWorldTransform()
        const rotated = localPoint.clone().rotateAround(new Vector2(0, 0), transform.rotation)
        return rotated.multiply(transform.scale).add(transform.position)
    }

    /**
     * Convert a point from world space to local space
     *
     * @param worldPoint - Point in world coordinates
     * @returns Point in local coordinates
     *
     * @example
     * ```typescript
     * const worldPoint = new Vector2(100, 100)
     * const localPoint = obj.worldToLocal(worldPoint)
     * ```
     */
    worldToLocal(worldPoint: Vector2): Vector2 {
        const transform = this.getWorldTransform()
        const local = worldPoint.clone().sub(transform.position)
        local.divide(transform.scale)
        return local.rotateAround(new Vector2(0, 0), -transform.rotation)
    }

    /**
     * Execute a callback for this object and all its visible descendants
     *
     * Skips invisible objects and their children.
     *
     * @param callback - Function to call for each visible object
     *
     * @example
     * ```typescript
     * scene.traverseVisible(obj => {
     *   // Only called for visible objects
     * })
     * ```
     */
    traverseVisible(callback: (object: Object2D) => void): void {
        if (!this.visible) return

        callback(this)

        for (const child of this.children) {
            if (child.visible) {
                child.traverseVisible(callback)
            }
        }
    }

    /**
     * Execute a callback for all ancestors of this object
     *
     * Walks up the parent chain to the root.
     *
     * @param callback - Function to call for each ancestor
     *
     * @example
     * ```typescript
     * child.traverseAncestors(parent => {
     *   console.log('Ancestor:', parent.name)
     * })
     * ```
     */
    traverseAncestors(callback: (object: Object2D) => void): void {
        if (this.parent) {
            callback(this.parent)
            this.parent.traverseAncestors(callback)
        }
    }

    /**
     * Find an object by its id
     *
     * Searches this object and all descendants.
     *
     * @param id - The id to search for
     * @returns The object if found, undefined otherwise
     *
     * @example
     * ```typescript
     * const player = scene.getObjectById('player-1')
     * ```
     */
    getObjectById(id: string): Object2D | undefined {
        if (this.id === id) return this

        for (const child of this.children) {
            const found = child.getObjectById(id)
            if (found) return found
        }

        return undefined
    }

    /**
     * Find an object by its name
     *
     * Searches this object and all descendants.
     *
     * @param name - The name to search for
     * @returns The object if found, undefined otherwise
     *
     * @example
     * ```typescript
     * const player = scene.getObjectByName('player')
     * ```
     */
    getObjectByName(name: string): Object2D | undefined {
        if (this.name === name) return this

        for (const child of this.children) {
            const found = child.getObjectByName(name)
            if (found) return found
        }

        return undefined
    }

    clone(): Object2D {
        const cloned = new Object2D()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        return cloned
    }
}
