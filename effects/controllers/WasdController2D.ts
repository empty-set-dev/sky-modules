import Vector2 from '@sky-modules/math/Vector2'

/**
 * Parameters for WasdController2D
 */
export interface WasdController2DParameters {
    /** Force multiplier function (default: 1) */
    force?: () => number

    /** Direction offset in radians (default: 0) */
    direction?: () => number

    /** Callback when input changes */
    onChange?: () => void
}

/**
 * WASD keyboard controller for 2D movement
 *
 * Captures W/A/S/D keyboard input and converts it to normalized 2D acceleration vector.
 * Supports force multiplier and direction rotation for flexible movement control.
 *
 * @example Basic usage
 * ```typescript
 * const controller = new WasdController2D([effect])
 * const accel = controller.acceleration // Vector2 based on WASD input
 * ```
 *
 * @example With force and direction
 * ```typescript
 * const controller = new WasdController2D([effect], {
 *     force: () => playerSpeed,
 *     direction: () => cameraAngle,
 *     onChange: () => console.log('Input changed')
 * })
 * ```
 */
export default class WasdController2D {
    readonly effect: Effect

    /** Force multiplier function */
    force: () => number

    /** Direction offset in radians */
    direction: () => number

    /**
     * Current acceleration vector
     *
     * Returns normalized input direction multiplied by force and rotated by direction offset.
     */
    get acceleration(): Vector2 {
        return this.__acceleration
            .clone()
            .multiplyScalar(this.force())
            .rotateAround(new Vector2(0, 0), this.direction())
    }

    /**
     * Create WASD controller
     *
     * @param dep - Effect dependency
     * @param parameters - Controller parameters
     */
    constructor(dep: EffectDep, parameters: WasdController2DParameters = {}) {
        this.effect = new Effect(dep, this)

        const { force, direction, onChange } = parameters

        this.force = force ?? ((): number => 1)
        this.direction = direction ?? ((): number => 0)

        const state: number[] = [0, 0, 0, 0]

        new WindowEventListener(
            'keydown',
            ev => {
                if (ev.code === 'KeyW') {
                    state[0] = 1
                }
                if (ev.code === 'KeyS') {
                    state[1] = 1
                }
                if (ev.code === 'KeyD') {
                    state[2] = 1
                }
                if (ev.code === 'KeyA') {
                    state[3] = 1
                }

                this.__acceleration.set(state[2] - state[3], state[0] - state[1]).normalize()

                onChange && onChange()
            },
            [this.effect]
        )

        new WindowEventListener(
            'keyup',
            ev => {
                if (ev.code === 'KeyW') {
                    state[0] = 0
                }
                if (ev.code === 'KeyS') {
                    state[1] = 0
                }
                if (ev.code === 'KeyD') {
                    state[2] = 0
                }
                if (ev.code === 'KeyA') {
                    state[3] = 0
                }

                this.__acceleration.set(state[2] - state[3], state[0] - state[1]).normalize()

                onChange && onChange()
            },
            [this.effect]
        )
    }

    __acceleration = new Vector2()
}
