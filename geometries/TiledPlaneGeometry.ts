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

        for (let i = 0; i < uvAttributes.count; i++) {
            const f = mapFactor

            const w = width
            const d = depth

            if (i === 0) {
                uvAttributes.setXY(i, (x - w / 2) * f, (y + d / 2) * f)
            } else if (i === 1) {
                uvAttributes.setXY(i, (x + w / 2) * f, (y + d / 2) * f)
            } else if (i === 2) {
                uvAttributes.setXY(i, (x - w / 2) * f, (y - d / 2) * f)
            } else if (i === 3) {
                uvAttributes.setXY(i, (x + w / 2) * f, (y - d / 2) * f)
            }
        }
    }
}
