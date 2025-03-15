import Three from 'sky/pkgs/three'

export interface SkyRendererParameters extends Three.WebGLRendererParameters {
    size: () => [number, number]
    pixelRatio: number
    disableShadows?: boolean
}
export default class SkyRenderer extends Three.WebGLRenderer {
    static context = true

    size: () => [number, number]
    readonly pixelRatio: number

    constructor(root: EffectsRoot, parameters: SkyRendererParameters) {
        super({
            premultipliedAlpha: true,
            antialias: true,
            ...parameters,
        })

        this.pixelRatio = parameters.pixelRatio

        this.toneMappingExposure = 1.0

        root.addContext(this)

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
            root
        )
    }
}
