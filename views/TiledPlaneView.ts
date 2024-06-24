import TiledPlaneGeometry from 'sky/geometries/TiledPlaneGeometry'
import { Material } from 'three/src/materials/Material'
import { Mesh } from 'three/src/objects/Mesh'

export interface TiledPlaneViewOptions {
    x: number
    y: number
    z: number
    width: number
    depth: number
    material: Material
    mapFactor?: number
}
export default class TiledPlaneView extends Mesh {
    constructor(options: TiledPlaneViewOptions) {
        const { material, x, y, z, width, depth, mapFactor } = options

        super(
            new TiledPlaneGeometry({
                x,
                y,
                width,
                depth,
                mapFactor,
            }),
            material
        )

        this.position.x = x + width / 2
        this.position.y = y + depth / 2
        this.position.z = z
    }
}
