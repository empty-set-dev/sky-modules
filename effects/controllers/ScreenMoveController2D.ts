import Enability from '@sky-modules/effects/mixins/EnabledMixin'
import Vector2 from '@sky-modules/math/Vector2'

/**
 * Parameters for ScreenMoveController2D
 */
export interface ScreenMoveController2DParameters {
    /** Camera position vector to control */
    camera: Vector2
}

export default interface ScreenMoveController2D extends Enability {}

/**
 * Screen edge scrolling controller for 2D camera
 *
 * Automatically scrolls camera when mouse approaches screen edges.
 * Uses 10px padding zone around screen edges. Velocity is proportional
 * to distance from edge (100x multiplier).
 *
 * Can be enabled/disabled via EnabledMixin.
 *
 * @example Basic usage
 * ```typescript
 * const camera = new Vector2()
 * const controller = new ScreenMoveController2D([effect], { camera })
 * // Camera will scroll when mouse near edges
 * ```
 *
 * @example With enable/disable
 * ```typescript
 * controller.enabled = false // Disable edge scrolling
 * controller.enabled = true  // Re-enable
 * ```
 */
@mixin(Enability)
export default class ScreenMoveController2D {
    readonly effect: Effect

    /** Current velocity vector for camera movement */
    velocity: Vector2 = new Vector2()

    /** Camera position vector being controlled */
    readonly camera: Vector2

    /**
     * Handle global mouse move events
     *
     * Calculates velocity based on distance from screen edges.
     *
     * @param ev - Mouse move event
     */
    @hook static onGlobalMouseMove(this: ScreenMoveController2D, ev: Sky.MouseMoveEvent): void {
        const padding = 10
        const left = -window.innerWidth / 2 + padding + this.camera.x
        const right = window.innerWidth / 2 - padding + this.camera.x
        const top = -window.innerHeight / 2 + padding + this.camera.y
        const bottom = window.innerHeight / 2 - padding + this.camera.y

        if (ev.x < left) {
            this.velocity.x = -(left - ev.x) * 100
        } else if (ev.x > right) {
            this.velocity.x = (ev.x - right) * 100
        } else {
            this.velocity.x = 0
        }

        if (ev.y < top) {
            this.velocity.y = -(top - ev.y) * 100
        } else if (ev.y > bottom) {
            this.velocity.y = (ev.y - bottom) * 100
        } else {
            this.velocity.y = 0
        }
    }

    /**
     * Create screen move controller
     *
     * @param dep - Effect dependency
     * @param parameters - Controller parameters
     */
    constructor(dep: EffectDep, parameters: ScreenMoveController2DParameters) {
        this.effect = new Effect(dep, this)
        Enability.super(this)

        this.camera = parameters.camera
    }

    /**
     * Update camera position based on velocity
     *
     * @param ev - Update event with delta time
     */
    protected update(ev: Sky.UpdateEvent): void {
        this.camera.add({ x: this.velocity.x * ev.dt, y: this.velocity.y * ev.dt })
    }
}
