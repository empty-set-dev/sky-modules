import Object2D from './Object2D'

/**
 * Container for grouping and organizing multiple objects
 *
 * Groups allow you to organize objects hierarchically and apply transforms
 * to multiple objects at once. Useful for managing related objects.
 *
 * @example
 * ```typescript
 * const group = new Group()
 * group.add(mesh1)
 * group.add(mesh2)
 * group.setPosition(100, 100)
 *
 * scene.add(group)
 *
 * // Both meshes move with the group
 * group.translateX(50)
 * ```
 *
 * @example
 * ```typescript
 * // Create a wheel with spokes
 * const wheel = new Group()
 * for (let i = 0; i < 8; i++) {
 *   const spoke = new Mesh(lineGeometry, material)
 *   spoke.setRotation((Math.PI * 2 / 8) * i)
 *   wheel.add(spoke)
 * }
 * // Rotate entire wheel as one unit
 * wheel.rotateZ(0.01)
 * ```
 */
export default class Group extends Object2D {
    static context = true

    /** Type identifier - always true for Group instances */
    readonly isGroup: boolean = true

    constructor() {
        super()
    }

    /**
     * Create a deep copy of this group and all its children
     *
     * Creates new instances of the group and all its children recursively.
     *
     * @returns Cloned group with all properties and children copied
     *
     * @example
     * ```typescript
     * const original = new Group()
     * original.add(mesh1)
     * original.add(mesh2)
     *
     * const copy = original.clone()
     * // copy has its own instances of mesh1 and mesh2
     * ```
     */
    clone(): Group {
        const cloned = new Group()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        cloned.id = this.id
        cloned.name = this.name

        // Clone children
        for (const child of this.children) {
            cloned.add(child.clone())
        }

        return cloned
    }
}
