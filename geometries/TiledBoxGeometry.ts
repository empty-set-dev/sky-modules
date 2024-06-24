import { BoxGeometry } from 'three/src/geometries/BoxGeometry'

export interface TiledBoxGeometryOptions {
    x: number
    y: number
    z: number
    width: number
    depth: number
    height: number
    mapFactor?: number
}
export default class TiledBoxGeometry extends BoxGeometry {
    constructor(options: TiledBoxGeometryOptions) {
        const { x, y, z, width, depth, height } = options
        let { mapFactor } = options
        mapFactor ??= 1
        super(width, depth, height)

        const uvAttribute = this.attributes.uv

        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i)
            const v = uvAttribute.getY(i)

            const f = mapFactor

            if (i === 0) {
                uvAttribute.setXY(i, (z + height / 2) * f, (v + y) * f)
            } else if (i === 1) {
                uvAttribute.setXY(i, (z - height / 2) * f, (v + y) * f)
            } else if (i === 2) {
                uvAttribute.setXY(i, (z + height / 2) * f, (v + y) * f)
            } else if (i === 3) {
                uvAttribute.setXY(i, (z - height / 2) * f, (v + y) * f)
            } else if (i === 4) {
                uvAttribute.setXY(i, (z + height / 2) * f, (v + y) * f)
            } else if (i === 5) {
                uvAttribute.setXY(i, (z - height / 2) * f, (v + y) * f)
            } else if (i === 6) {
                uvAttribute.setXY(i, (z + height / 2) * f, (v + y) * f)
            } else if (i === 7) {
                uvAttribute.setXY(i, (z - height / 2) * f, (v + y) * f)
            } else if (i === 8) {
                uvAttribute.setXY(i, (u + x) * f, (z - height / 2) * f)
            } else if (i === 9) {
                uvAttribute.setXY(i, (u + x) * f, (z - height / 2) * f)
            } else if (i === 10) {
                uvAttribute.setXY(i, (u + x) * f, (z + height / 2) * f)
            } else if (i === 11) {
                uvAttribute.setXY(i, (u + x) * f, (z + height / 2) * f)
            } else if (i === 12) {
                uvAttribute.setXY(i, (u + x) * f, (z - height / 2) * f)
            } else if (i === 13) {
                uvAttribute.setXY(i, (u + x) * f, (z - height / 2) * f)
            } else if (i === 14) {
                uvAttribute.setXY(i, (u + x) * f, (z + height / 2) * f)
            } else if (i === 15) {
                uvAttribute.setXY(i, (u + x) * f, (z + height / 2) * f)
            } else {
                uvAttribute.setXY(i, (u + x) * f, (v + y) * f)
            }
        }
    }
}
