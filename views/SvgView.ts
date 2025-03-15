import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'

export interface SvgViewParameters {
    path: string
    color: number
    w?: number
    h?: number
}
export default class SvgView extends Three.Group {
    constructor(parameters: SvgViewParameters) {
        super()

        return asyncConstructor(this, SvgView.asyncConstructor, parameters)
    }

    private static async asyncConstructor(
        this: SvgView,
        parameters: SvgViewParameters
    ): Promise<void> {
        const loader = new SVGLoader()
        const svgString = await fetch.text(parameters.path)
        const iconView = new Three.Group()

        loader.parse(svgString).paths.forEach(path => {
            path.toShapes(true).forEach(shape => {
                const mesh = new Three.Mesh(
                    new Three.ShapeGeometry(shape),
                    new Three.MeshBasicMaterial({
                        color: parameters.color,
                        side: Three.DoubleSide,
                        depthWrite: false,
                    })
                )
                iconView.add(mesh)
            })
        })

        const box = new Three.Box3().setFromObject(iconView)
        iconView.scale.y = -1

        if (parameters.w != null) {
            const w = box.max.x - box.min.x

            iconView.scale.x = parameters.w / w
            iconView.scale.y = -iconView.scale.x
        } else if (parameters.h != null) {
            const h = box.max.y - box.min.y

            iconView.scale.y = -parameters.h / h
            iconView.scale.x = -iconView.scale.y
        }

        box.setFromObject(iconView)
        box.getCenter(iconView.position)
        iconView.position.x = -iconView.position.x
        iconView.position.y = -iconView.position.y

        const pivot = new Three.Group()
        pivot.add(iconView)
        this.add(pivot)
    }
}
