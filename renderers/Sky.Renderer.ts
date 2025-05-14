import Three from 'pkgs/three'
import globalify from 'sky/utilities/globalify'

declare global {
    namespace Sky {
        interface RendererParameters extends SkyModule.RendererParameters {}
        class Renderer extends SkyModule.Renderer {}
    }
}

namespace SkyModule {
    export interface RendererParameters extends Three.WebGLRendererParameters {
        size: () => [number, number]
        pixelRatio: number
        disableShadows?: boolean
    }
    export class Renderer extends Three.WebGLRenderer {
        static context = true

        size: () => [number, number]
        readonly pixelRatio: number

        constructor(effect: EffectsRoot, parameters: RendererParameters) {
            super({
                premultipliedAlpha: true,
                antialias: true,
                ...parameters,
            })

            effect.addContext(this)

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
                effect
            )
        }
    }
}

globalify.namespace('Sky', SkyModule)
