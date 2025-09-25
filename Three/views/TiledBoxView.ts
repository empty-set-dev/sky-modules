import TiledBoxGeometry from 'sky/Three/geometries/TiledBoxGeometry'
import { Material } from 'three/src/materials/Material'
import { Mesh } from 'three/src/objects/Mesh'

export interface TiledBoxViewParameters {
    x: number
    y: number
    z: number
    width: number
    depth: number
    height: number
    material: Material
    mapFactor?: number
}
export default class TiledBoxView extends Mesh {
    constructor(parameters: TiledBoxViewParameters) {
        const { material, x, y, z, width, depth, height, mapFactor } = parameters

        super(
            new TiledBoxGeometry({
                x,
                y,
                z,
                width,
                depth,
                height,
                mapFactor,
            }),
            material
        )

        this.position.x = x + width / 2
        this.position.y = y + depth / 2
        this.position.z = z + height / 2
    }
}
