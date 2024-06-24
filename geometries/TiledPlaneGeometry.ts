import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'

export interface TiledPlaneGeometryOptions {
    x: number
    y: number
    width: number
    depth: number
    mapFactor?: number
}
export default class TiledPlaneGeometry extends PlaneGeometry {
    constructor(options: TiledPlaneGeometryOptions) {
        const { x, y, width, depth } = options
        let { mapFactor } = options
        mapFactor ??= 1
        super(width, depth)

        const uvAttribute = this.attributes.uv

        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i)
            const v = uvAttribute.getY(i)

            const f = mapFactor
            uvAttribute.setXY(i, (u + x) * f, (v + y) * f)
        }
    }
}
