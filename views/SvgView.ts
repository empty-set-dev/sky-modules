import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'

export interface SvgViewParameters {
    path: string
    color: Three.ColorRepresentation
    w?: number
    h?: number
}
export default class SvgView extends Three.Group {
    pivot!: Three.Group
    view!: Three.Group
    shapes!: Three.Mesh[]

    constructor(parameters: SvgViewParameters) {
        super()

        return asyncConstructor(this, SvgView.asyncConstructor, parameters)
    }

    private static async asyncConstructor(
        this: SvgView,
        parameters: SvgViewParameters
    ): Promise<void> {
        this.shapes = []

        const loader = new SVGLoader()
        const svgString = await fetch.text(parameters.path)
        const view = (this.view = new Three.Group())

        loader.parse(svgString).paths.forEach(path => {
            path.toShapes(true).forEach(shape => {
                const mesh = new Three.Mesh(
                    new Three.ShapeGeometry(shape),
                    new Three.MeshBasicMaterial({
                        color: parameters.color,
                        depthWrite: false,
                    })
                )
                view.add(mesh)
                this.shapes.push(mesh)
            })
        })

        const box = new Three.Box3().setFromObject(view)
        view.scale.y = -1

        if (parameters.w != null) {
            const w = box.max.x - box.min.x

            view.scale.x = parameters.w / w
            view.scale.y = -view.scale.x
        } else if (parameters.h != null) {
            const h = box.max.y - box.min.y

            view.scale.y = -parameters.h / h
            view.scale.x = -view.scale.y
        }

        box.setFromObject(view)
        box.getCenter(view.position)
        view.position.x = -view.position.x
        view.position.y = -view.position.y

        const pivot = (this.pivot = new Three.Group())
        pivot.add(view)
        this.add(pivot)
    }

    applyColor(color: Three.ColorRepresentation): this {
        this.shapes.forEach(shape => {
            const material = shape.material as Three.MeshBasicMaterial
            material.color = new Three.Color(color)
        })

        return this
    }
}
