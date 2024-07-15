import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

export interface SkyPerspectiveCameraOptions {
    fov?: () => number
    aspect: () => number
    near: () => number
    far: () => number
}
export default class SkyPerspectiveCamera extends PerspectiveCamera {
    /**
     * @param {EffectDeps} deps
     * @param {number} fov
     * @param {number} aspect
     * @param {number} near
     * @param {number} far
     */
    constructor(deps: EffectDeps, fov?: number, aspect?: number, near?: number, far?: number) {
        super(fov, aspect, near, far)

        this.up.set(0, 0, 1)

        new WindowEventListener(
            'resize',
            () => {
                this.aspect = window.innerWidth / window.innerHeight
                this.updateProjectionMatrix()
            },
            deps
        )
    }
}
