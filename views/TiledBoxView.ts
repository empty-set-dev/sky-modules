import { BoxGeometry } from 'three/src/geometries/BoxGeometry'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { Material } from 'three/src/materials/Material'
import { Mesh } from 'three/src/objects/Mesh'

export interface TiledBoxViewOptions {
    x: number
    y: number
    z: number
    width: number
    depth: number
    height: number
    material: Material
    mapFactor?: number
}
export default function TiledBoxView(options: TiledBoxViewOptions): Mesh {
    const { material, x, y, z, width, depth, height } = options
    let { mapFactor } = options
    mapFactor ??= 1

    let mesh: Mesh
    if (height === 0) {
        mesh = new Mesh(new PlaneGeometry(1, 1, 1, 1), material)
    } else {
        mesh = new Mesh(new BoxGeometry(1, 1, height, 1, 1, 1), material)
    }

    const uvAttribute = mesh.geometry.attributes.uv

    for (let i = 0; i < uvAttribute.count; i++) {
        const u = uvAttribute.getX(i)
        const v = uvAttribute.getY(i)

        const f = mapFactor
        if (height !== 0) {
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
        } else {
            uvAttribute.setXY(i, (u + x) * f, (v + y) * f)
        }
    }

    mesh.position.x = x + width / 2
    mesh.position.y = y + depth / 2
    mesh.position.z = z + height / 2

    return mesh
}
