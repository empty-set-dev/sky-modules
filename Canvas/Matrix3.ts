import Vector2 from '@sky-modules/math/Vector2'

export default class Matrix3 {
    static context = true

    elements: Float32Array

    constructor() {
        this.elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ])
    }

    set(
        n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number
    ): this {
        const te = this.elements

        te[0] = n11; te[1] = n21; te[2] = n31
        te[3] = n12; te[4] = n22; te[5] = n32
        te[6] = n13; te[7] = n23; te[8] = n33

        return this
    }

    identity(): this {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
        return this
    }

    copy(m: Matrix3): this {
        const te = this.elements
        const me = m.elements

        te[0] = me[0]; te[1] = me[1]; te[2] = me[2]
        te[3] = me[3]; te[4] = me[4]; te[5] = me[5]
        te[6] = me[6]; te[7] = me[7]; te[8] = me[8]

        return this
    }

    clone(): Matrix3 {
        return new Matrix3().copy(this)
    }

    multiply(m: Matrix3): this {
        return this.multiplyMatrices(this, m)
    }

    premultiply(m: Matrix3): this {
        return this.multiplyMatrices(m, this)
    }

    multiplyMatrices(a: Matrix3, b: Matrix3): this {
        const ae = a.elements
        const be = b.elements
        const te = this.elements

        const a11 = ae[0], a12 = ae[3], a13 = ae[6]
        const a21 = ae[1], a22 = ae[4], a23 = ae[7]
        const a31 = ae[2], a32 = ae[5], a33 = ae[8]

        const b11 = be[0], b12 = be[3], b13 = be[6]
        const b21 = be[1], b22 = be[4], b23 = be[7]
        const b31 = be[2], b32 = be[5], b33 = be[8]

        te[0] = a11 * b11 + a12 * b21 + a13 * b31
        te[3] = a11 * b12 + a12 * b22 + a13 * b32
        te[6] = a11 * b13 + a12 * b23 + a13 * b33

        te[1] = a21 * b11 + a22 * b21 + a23 * b31
        te[4] = a21 * b12 + a22 * b22 + a23 * b32
        te[7] = a21 * b13 + a22 * b23 + a23 * b33

        te[2] = a31 * b11 + a32 * b21 + a33 * b31
        te[5] = a31 * b12 + a32 * b22 + a33 * b32
        te[8] = a31 * b13 + a32 * b23 + a33 * b33

        return this
    }

    makeTranslation(x: number, y: number): this {
        this.set(
            1, 0, x,
            0, 1, y,
            0, 0, 1
        )
        return this
    }

    makeRotation(theta: number): this {
        const c = Math.cos(theta)
        const s = Math.sin(theta)

        this.set(
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        )

        return this
    }

    makeScale(x: number, y: number): this {
        this.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        )
        return this
    }

    compose(position: Vector2, rotation: number, scale: Vector2): this {
        const cos = Math.cos(rotation)
        const sin = Math.sin(rotation)

        this.set(
            scale.x * cos, -scale.x * sin, position.x,
            scale.y * sin, scale.y * cos, position.y,
            0, 0, 1
        )

        return this
    }

    decompose(position: Vector2, rotation: { value: number }, scale: Vector2): this {
        const te = this.elements

        position.x = te[6]
        position.y = te[7]

        const sx = Math.sqrt(te[0] * te[0] + te[1] * te[1])
        const sy = Math.sqrt(te[3] * te[3] + te[4] * te[4])

        scale.x = sx
        scale.y = sy

        rotation.value = Math.atan2(te[1] / sx, te[0] / sx)

        return this
    }

    invert(): this {
        const te = this.elements

        const n11 = te[0], n21 = te[1], n31 = te[2]
        const n12 = te[3], n22 = te[4], n32 = te[5]
        const n13 = te[6], n23 = te[7], n33 = te[8]

        const t11 = n33 * n22 - n32 * n23
        const t12 = n32 * n13 - n33 * n12
        const t13 = n23 * n12 - n22 * n13

        const det = n11 * t11 + n21 * t12 + n31 * t13

        if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0)

        const detInv = 1 / det

        te[0] = t11 * detInv
        te[1] = (n31 * n23 - n33 * n21) * detInv
        te[2] = (n32 * n21 - n31 * n22) * detInv

        te[3] = t12 * detInv
        te[4] = (n33 * n11 - n31 * n13) * detInv
        te[5] = (n31 * n12 - n32 * n11) * detInv

        te[6] = t13 * detInv
        te[7] = (n21 * n13 - n23 * n11) * detInv
        te[8] = (n22 * n11 - n21 * n12) * detInv

        return this
    }

    transformVector2(v: Vector2): Vector2 {
        const te = this.elements
        const x = v.x, y = v.y

        return new Vector2(
            te[0] * x + te[3] * y + te[6],
            te[1] * x + te[4] * y + te[7]
        )
    }

    equals(matrix: Matrix3): boolean {
        const te = this.elements
        const me = matrix.elements

        for (let i = 0; i < 9; i++) {
            if (te[i] !== me[i]) return false
        }

        return true
    }

    fromArray(array: number[], offset: number = 0): this {
        for (let i = 0; i < 9; i++) {
            this.elements[i] = array[i + offset]
        }

        return this
    }

    toArray(array: number[] = [], offset: number = 0): number[] {
        const te = this.elements

        array[offset] = te[0]
        array[offset + 1] = te[1]
        array[offset + 2] = te[2]

        array[offset + 3] = te[3]
        array[offset + 4] = te[4]
        array[offset + 5] = te[5]

        array[offset + 6] = te[6]
        array[offset + 7] = te[7]
        array[offset + 8] = te[8]

        return array
    }
}