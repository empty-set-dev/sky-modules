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

        const uvAttributes = this.attributes.uv

        for (let i = 0; i < uvAttributes.count; i++) {
            const u = uvAttributes.getX(i)
            const v = uvAttributes.getY(i)

            const f = mapFactor
            // const w = width
            // const d = depth
            const h = height

            if (i === 0) {
                uvAttributes.setXY(i, (z + h / 2) * f, (v + y) * f)
            } else if (i === 1) {
                uvAttributes.setXY(i, (z - h / 2) * f, (v + y) * f)
            } else if (i === 2) {
                uvAttributes.setXY(i, (z + h / 2) * f, (v + y) * f)
            } else if (i === 3) {
                uvAttributes.setXY(i, (z - h / 2) * f, (v + y) * f)
            } else if (i === 4) {
                uvAttributes.setXY(i, (z + h / 2) * f, (v + y) * f)
            } else if (i === 5) {
                uvAttributes.setXY(i, (z - h / 2) * f, (v + y) * f)
            } else if (i === 6) {
                uvAttributes.setXY(i, (z + h / 2) * f, (v + y) * f)
            } else if (i === 7) {
                uvAttributes.setXY(i, (z - h / 2) * f, (v + y) * f)
            } else if (i === 8) {
                uvAttributes.setXY(i, (u + x) * f, (z - h / 2) * f)
            } else if (i === 9) {
                uvAttributes.setXY(i, (u + x) * f, (z - h / 2) * f)
            } else if (i === 10) {
                uvAttributes.setXY(i, (u + x) * f, (z + h / 2) * f)
            } else if (i === 11) {
                uvAttributes.setXY(i, (u + x) * f, (z + h / 2) * f)
            } else if (i === 12) {
                uvAttributes.setXY(i, (u + x) * f, (z - h / 2) * f)
            } else if (i === 13) {
                uvAttributes.setXY(i, (u + x) * f, (z - h / 2) * f)
            } else if (i === 14) {
                uvAttributes.setXY(i, (u + x) * f, (z + h / 2) * f)
            } else if (i === 15) {
                uvAttributes.setXY(i, (u + x) * f, (z + h / 2) * f)
            } else {
                uvAttributes.setXY(i, (u + x) * f, (v + y) * f)
            }
        }
    }
}
