import Three from 'sky/pkgs/three'

export interface SkyPerspectiveCameraOptions {
    fov?: () => number
    aspect: () => number
    near: () => number
    far: () => number
}
export default class SkyPerspectiveCamera extends Three.PerspectiveCamera {
    constructor(deps: EffectDeps, fov?: number, near?: number, far?: number) {
        super(fov, window.innerWidth / window.innerHeight, near, far)

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
