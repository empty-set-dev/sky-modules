import Three from 'pkgs/three'
import globalify from '@sky-modules/core/globalify'

declare global {
    namespace Sky {
        interface RendererParameters extends lib.RendererParameters {}
        class Renderer extends lib.Renderer {}
    }
}

namespace lib {
    export interface RendererParameters extends Three.WebGLRendererParameters {
        size: () => [number, number]
        pixelRatio: number
        disableShadows?: boolean
    }
    export class Renderer extends Three.WebGLRenderer {
        static context: true

        readonly effect: Effect
        size: () => [number, number]
        readonly pixelRatio: number

        constructor(
            deps: EffectDeps,
            targetOfContext: Effect | EffectsRoot,
            parameters: RendererParameters
        ) {
            super({
                premultipliedAlpha: true,
                antialias: true,
                ...parameters,
            })

            this.effect = new Effect(deps, this)

            targetOfContext.addContext(Renderer, this)

            this.pixelRatio = parameters.pixelRatio

            this.toneMappingExposure = 1.0

            if (parameters.disableShadows !== false) {
                this.shadowMap.enabled = true
                this.shadowMap.type = Three.PCFSoftShadowMap
            }

            this.size = parameters.size

            {
                const [w, h] = parameters.size()
                this.setSize(w * this.pixelRatio, h * this.pixelRatio, false)
            }

            new WindowEventListener(
                'resize',
                () => {
                    const [w, h] = parameters.size()
                    this.setSize(w * this.pixelRatio, h * this.pixelRatio, false)
                },
                this.effect
            )
        }
    }
}

globalify.namespace('Sky', lib)
