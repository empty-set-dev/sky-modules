import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

export default class SkyPerspectiveCamera extends PerspectiveCamera {
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
