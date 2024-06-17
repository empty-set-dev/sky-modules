import { WebGLRenderer, WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer'

export interface SkyRendererParameters extends WebGLRendererParameters {
    size: () => [number, number]
    disableShadows?: boolean
}
export default class SkyRenderer extends WebGLRenderer {
    constructor(deps: EffectDeps, parameters?: SkyRendererParameters) {
        super({
            premultipliedAlpha: true,
            antialias: true,
            ...parameters,
        })

        if (parameters.disableShadows !== false) {
            this.shadowMap.enabled = true
        }

        const [w, h] = parameters.size()
        this.setSize(w, h, false)

        new WindowEventListener(
            'resize',
            () => {
                const [w, h] = parameters.size()
                this.setSize(w, h, false)
            },
            deps
        )
    }
}
