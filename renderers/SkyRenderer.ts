import Three from '@pkgs/three'

export interface SkyRendererParameters extends Three.WebGLRendererParameters {
    size: () => [number, number]
    disableShadows?: boolean
}
export default class SkyRenderer extends Three.WebGLRenderer {
    static context = 'SkyRendererContext'
    size: () => [number, number]

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
            this.shadowMap.type = Three.PCFSoftShadowMap
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
