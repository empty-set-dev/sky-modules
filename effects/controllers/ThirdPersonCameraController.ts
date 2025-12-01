import Vector3 from '@sky-modules/math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import SmartPointerLock from '../SmartPointerLock'

/**
 * Parameters for ThirdPersonCameraController
 */
export interface ThirdPersonCameraControllerParameters {
    /** Camera to control */
    camera: PerspectiveCamera

    /** Function returning target position to orbit around */
    getTarget: () => Vector3

    /** Enable pointer lock for mouse capture (default: true) */
    hasPointerLock?: boolean

    /** Minimum vertical angle in radians (default: -PI/2 + 0.001) */
    minAngle?: () => number

    /** Maximum vertical angle in radians (default: PI/2 - 0.001) */
    maxAngle?: () => number

    /** Distance from target (default: 10) */
    distance: () => number

    /** Z offset from target (default: 0) */
    z?: () => number

    /** Callback when camera updates */
    onUpdate?: () => void
}

/**
 * Third-person camera controller with mouse orbit
 *
 * Controls camera to orbit around a moving target with mouse input.
 * Supports pointer lock, angle clamping, and dynamic distance/height adjustments.
 *
 * @example Basic usage
 * ```typescript
 * const controller = new ThirdPersonCameraController([effect], {
 *     camera: camera,
 *     getTarget: () => player.position,
 *     distance: () => 10,
 *     onUpdate: () => renderer.render()
 * })
 * ```
 *
 * @example Custom angle limits
 * ```typescript
 * const controller = new ThirdPersonCameraController([effect], {
 *     camera: camera,
 *     getTarget: () => target,
 *     minAngle: () => -Math.PI / 4, // 45 degrees down
 *     maxAngle: () => Math.PI / 3,  // 60 degrees up
 *     distance: () => cameraDistance,
 *     z: () => 2 // Look 2 units above target
 * })
 * ```
 */
export default class ThirdPersonCameraController {
    readonly effect: Effect

    /** Camera to control */
    camera: PerspectiveCamera

    /** Target position getter */
    getTarget: () => Vector3

    /** Current camera angles [horizontal, vertical] in radians */
    readonly angles = [Math.PI / 2, 0]

    /** Minimum vertical angle */
    minAngle = (): number => -Math.PI / 2 + 0.001

    /** Maximum vertical angle */
    maxAngle = (): number => Math.PI / 2 - 0.001

    /** Distance from target */
    distance: () => number

    /** Z offset from target */
    z: () => number

    /**
     * Create third-person camera controller
     *
     * @param dep - Effect dependency
     * @param parameters - Controller parameters
     */
    constructor(dep: EffectDep, parameters: ThirdPersonCameraControllerParameters) {
        this.effect = new Effect(deps)

        const { onUpdate } = parameters
        this.camera = parameters.camera
        this.getTarget = parameters.getTarget
        this.minAngle = parameters.minAngle ?? ((): number => -Math.PI / 2 + 0.001)
        this.maxAngle = parameters.maxAngle ?? ((): number => Math.PI / 2 - 0.001)
        this.distance = parameters.distance ?? ((): number => 10)
        this.z = parameters.z ?? ((): number => 0)
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
        onUpdate && onUpdate()

        if (parameters.hasPointerLock !== false) {
            this.__smartPointerLock = new SmartPointerLock(this.effect)
        }

        new WindowEventListener(
            'mousemove',
            ev => {
                if (this.__smartPointerLock && !this.__smartPointerLock.isLocked) {
                    return
                }

                this.angles[0] += ev.movementX * 0.01
                this.angles[1] += ev.movementY * 0.01
                this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
                onUpdate && onUpdate()
            },
            [this.effect]
        )
    }

    /**
     * Update camera position and orientation
     *
     * Calculates spherical coordinates around target and updates camera transform.
     */
    updateCamera(): void {
        const { camera, distance } = this
        const target = this.getTarget()

        camera.position.x =
            target.x + Math.cos(this.angles[0]) * Math.cos(this.angles[1]) * distance()
        camera.position.y =
            target.y - Math.sin(this.angles[0]) * Math.cos(this.angles[1]) * distance()
        camera.position.z = target.z + this.z() + Math.sin(this.angles[1]) * distance()
        camera.lookAt(new Vector3(target.x, target.y, target.z + this.z()))
    }

    /**
     * Animation frame callback
     *
     * Updates camera position and clamps vertical angle every frame.
     */
    protected afterAnimationFrame(): void {
        this.updateCamera()
        this.angles[1] = Math.minmax(this.angles[1], this.minAngle(), this.maxAngle())
    }

    __smartPointerLock?: SmartPointerLock
}
