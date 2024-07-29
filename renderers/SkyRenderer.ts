import { PCFSoftShadowMap } from 'three/src/constants'
import { WebGLRenderer, WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer'

export interface SkyRendererParameters extends WebGLRendererParameters {
    size: () => [number, number]
    disableShadows?: boolean
}
export default class SkyRenderer extends WebGLRenderer {
    static context = 'SkyRendererContext'
    size: () => [number, number]

    /**
     * @param {Root} root
     * @param {SkyRendererParameters} parameters
     */
    constructor(root: Root, parameters: SkyRendererParameters) {
        super({
            premultipliedAlpha: true,
            antialias: true,
            ...parameters,
        })

        this.toneMappingExposure = 1.0

        root.addContext(this)

        if (parameters.disableShadows !== false) {
            this.shadowMap.enabled = true
            this.shadowMap.type = PCFSoftShadowMap
        }

        this.size = parameters.size
        const [w, h] = parameters.size()
        this.setSize(w, h, false)

        new WindowEventListener(
            'resize',
            () => {
                const [w, h] = parameters.size()
                this.setSize(w, h, false)
            },
            root
        )
    }
}
