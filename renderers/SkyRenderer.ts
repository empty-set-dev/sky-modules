import Three from 'sky/pkgs/three'

export interface SkyRendererParameters extends Three.WebGLRendererParameters {
    size: () => [number, number]
    disableShadows?: boolean
}
export default class SkyRenderer extends Three.WebGLRenderer {
    static context = true

    size: () => [number, number]

    constructor(root: EffectsRoot, parameters: SkyRendererParameters) {
        super({
            premultipliedAlpha: true,
            antialias: true,
            ...parameters,
        })

        this.toneMappingExposure = 1.0

        root.addContext(this)

        if (parameters.disableShadows !== false) {
            this.shadowMap.enabled = true
            this.shadowMap.type = Three.PCFSoftShadowMap
        }

        this.size = parameters.size
        this.setSize(...parameters.size(), false)

        new WindowEventListener(
            'resize',
            () => {
                this.setSize(...parameters.size(), false)
            },
            root
        )
    }
}
