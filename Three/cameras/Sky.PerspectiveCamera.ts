import Three from 'pkgs/three'
import globalify from '@sky-modules/core/globalify'

declare global {
    namespace Sky {
        interface PerspectiveCameraParameters extends lib.PerspectiveCameraParameters {}
        class PerspectiveCamera extends lib.PerspectiveCamera {}
    }
}

namespace lib {
    export interface PerspectiveCameraParameters {
        fov?: () => number
        aspect?: () => number
        near: () => number
        far: () => number
    }
    export class PerspectiveCamera extends Three.PerspectiveCamera {
        readonly effect: Effect

        constructor(dep: EffectDep, parameters: PerspectiveCameraParameters) {
            const aspect =
                parameters.aspect ?? ((): number => window.innerWidth / window.innerHeight)

            super(
                parameters.fov ? parameters.fov() : 120,
                aspect(),
                parameters.near(),
                parameters.far()
            )

            this.effect = new Effect(deps, this)

            new WindowEventListener(
                'resize',
                () => {
                    this.aspect = aspect()
                    this.updateProjectionMatrix()
                },
                this.effect
            )
        }
    }
}

globalify.namespace('Sky', lib)
