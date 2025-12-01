import '@sky-modules/three/renderers/Sky.Renderer'

import { Camera } from 'pkgs/three'
import Vector2 from '@sky-modules/math/Vector2'
import Vector3 from '@sky-modules/math/Vector3'

/**
 * Parameters for MouseController
 */
export interface MouseControllerParameters {
    /** Callback when mouse position updates */
    onUpdate?: () => void
}

/**
 * Mouse position tracker for 3D rendering
 *
 * Tracks mouse position in normalized device coordinates (-1 to 1) and provides
 * camera projection utilities for raycasting and 3D positioning.
 *
 * Requires Sky.Renderer context for coordinate conversion.
 *
 * @example Basic usage
 * ```typescript
 * const mouseController = new MouseController([effect], {
 *     onUpdate: () => console.log('Mouse moved:', mouseController.mouse)
 * })
 * ```
 *
 * @example Camera projection
 * ```typescript
 * const worldPos = mouseController.getCameraProjectionXY({
 *     camera: perspectiveCamera,
 *     z: 0 // Project to z=0 plane
 * })
 * ```
 */
export default class MouseController {
    readonly effect: Effect

    /** Mouse position in normalized device coordinates (-1 to 1) */
    mouse = new Vector2()

    /** Update callback */
    onUpdate?: () => void

    /**
     * Create mouse controller
     *
     * @param dep - Effect dependency
     * @param parameters - Controller parameters
     */
    constructor(dep: EffectDep, parameters?: MouseControllerParameters) {
        this.effect = new Effect(dep, this)

        if (parameters) {
            const { onUpdate } = parameters

            this.onUpdate = onUpdate
        }
    }

    /**
     * Initialize renderer context listeners
     *
     * Sets up mousemove and resize event listeners. Called automatically when
     * Sky.Renderer context is available.
     */
    onRendererContext(): void {
        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse = new Vector2(ev.clientX, ev.clientY)
                this.__updateMouse()
            },
            [this.effect]
        )
        new WindowEventListener(
            'resize',
            () => {
                this.__updateMouse()
            },
            [this.effect]
        )
    }

    /**
     * Project mouse position to 3D world coordinates
     *
     * Converts normalized mouse coordinates to world space position at specified Z depth.
     * Useful for mouse picking and raycasting.
     *
     * @param parameters - Projection parameters
     * @param parameters.camera - Camera to use for projection
     * @param parameters.z - Z depth for projection plane
     * @returns World space XY position
     */
    getCameraProjectionXY(parameters: { camera: Camera; z: number }): Vector2 {
        const { camera, z } = parameters
        const vec = new Vector3(this.mouse.x, this.mouse.y, z)
        vec.unproject(camera)
        vec.sub(camera.position).normalize()
        const distance = -camera.position.z / vec.z
        const position = new Vector3().copy(camera.position).add(vec.multiplyScalar(distance))
        return new Vector2().copy(position)
    }

    __updateMouse(): void {
        const renderer = this.effect.context(Sky.Renderer)
        const [w, h] = renderer.size()
        this.mouse.set((this.__mouse.x / w) * 2 - 1, -(this.__mouse.y / h) * 2 + 1)
        this.onUpdate && this.onUpdate()
    }

    private __mouse!: Vector2
}
