import Object2D from './Object2D'

/**
 * Root container for all renderable objects in the scene graph
 *
 * Scene extends Object2D and adds background support. All objects rendered
 * on the canvas should be added to a Scene.
 *
 * @example
 * ```typescript
 * const scene = new Scene()
 * scene.setBackground('#000000')
 *
 * // Add objects to scene
 * scene.add(mesh)
 * scene.add(group)
 *
 * // Render the scene
 * canvas.render(scene)
 * ```
 */
export default class Scene extends Object2D {
    static context = true

    /** Background color, gradient, or pattern for the scene */
    background?: string | CanvasGradient | CanvasPattern

    /**
     * Set the background of the scene
     *
     * @param background - CSS color, CanvasGradient, or CanvasPattern
     * @returns This scene for method chaining
     *
     * @example
     * ```typescript
     * // Solid color
     * scene.setBackground('#1a1a1a')
     *
     * // Gradient
     * const gradient = canvas.createLinearGradient(0, 0, 800, 600)
     * gradient.addColorStop(0, '#000000')
     * gradient.addColorStop(1, '#333333')
     * scene.setBackground(gradient)
     * ```
     */
    setBackground(background: string | CanvasGradient | CanvasPattern): this {
        this.background = background
        return this
    }

    /**
     * Create a deep copy of this scene
     *
     * @returns Cloned scene with copied properties
     */
    clone(): Scene {
        const cloned = new Scene()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        if (this.background) cloned.background = this.background
        return cloned
    }
}
