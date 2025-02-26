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

        const uvAttributes = this.attributes.uv

        const f = mapFactor

        const w = width
        const d = depth

        uvAttributes.setXY(0, (x - w / 2) * f, (y + d / 2) * f)
        uvAttributes.setXY(1, (x + w / 2) * f, (y + d / 2) * f)
        uvAttributes.setXY(2, (x - w / 2) * f, (y - d / 2) * f)
        uvAttributes.setXY(3, (x + w / 2) * f, (y - d / 2) * f)
    }
}
