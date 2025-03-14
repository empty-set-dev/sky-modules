import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'

export interface SvgViewParams {
    path: string
    color: number
    w?: number
    h?: number
}
export default class SvgView extends Three.Group {
    constructor(params: SvgViewParams) {
        super()

        return asyncConstructor(async () => {
            const loader = new SVGLoader()
            const svgString = await fetch.text(params.path)
            const iconGroup = new Three.Group()

            loader.parse(svgString).paths.forEach(path => {
                path.toShapes(true).forEach(shape => {
                    const mesh = new Three.Mesh(
                        new Three.ShapeGeometry(shape),
                        new Three.MeshBasicMaterial({
                            color: params.color,
                            side: Three.DoubleSide,
                            depthWrite: false,
                        })
                    )
                    iconGroup.add(mesh)
                })
            })

            const box = new Three.Box3().setFromObject(iconGroup)
            box.getCenter(iconGroup.position)
            iconGroup.position.multiplyScalar(-1)

            const pivot = new Three.Group()
            pivot.add(iconGroup)
            pivot.scale.y = -1

            if (params.w != null) {
                const w = box.max.x - box.min.x

                pivot.scale.x = params.w / w
                pivot.scale.y = -pivot.scale.x
            } else if (params.h != null) {
                const h = box.max.y - box.min.y

                pivot.scale.y = -params.h / h
                pivot.scale.x = -pivot.scale.y
            }

            this.add(pivot)

            return this
        })
    }
}
