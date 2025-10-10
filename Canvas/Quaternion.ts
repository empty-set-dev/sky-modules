export default class Quaternion {
    static context = true

    x: number
    y: number
    z: number
    w: number

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    set(x: number, y: number, z: number, w: number): this {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        return this
    }

    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w)
    }

    copy(q: Quaternion): this {
        this.x = q.x
        this.y = q.y
        this.z = q.z
        this.w = q.w
        return this
    }

    setFromAxisAngle(axis: { x: number; y: number; z: number }, angle: number): this {
        const halfAngle = angle / 2
        const s = Math.sin(halfAngle)

        this.x = axis.x * s
        this.y = axis.y * s
        this.z = axis.z * s
        this.w = Math.cos(halfAngle)

        return this
    }

    // For 2D rotation around Z-axis
    setFromRotationZ(angle: number): this {
        return this.setFromAxisAngle({ x: 0, y: 0, z: 1 }, angle)
    }

    multiply(q: Quaternion): this {
        return this.multiplyQuaternions(this, q)
    }

    premultiply(q: Quaternion): this {
        return this.multiplyQuaternions(q, this)
    }

    multiplyQuaternions(a: Quaternion, b: Quaternion): this {
        const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w
        const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w

        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz

        return this
    }

    normalize(): this {
        let l = this.length()

        if (l === 0) {
            this.x = 0
            this.y = 0
            this.z = 0
            this.w = 1
        } else {
            l = 1 / l
            this.x = this.x * l
            this.y = this.y * l
            this.z = this.z * l
            this.w = this.w * l
        }

        return this
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    lengthSq(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }

    // Get rotation angle around Z-axis for 2D
    getRotationZ(): number {
        return Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z))
    }

    conjugate(): this {
        this.x *= -1
        this.y *= -1
        this.z *= -1
        return this
    }

    dot(v: Quaternion): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w
    }

    identity(): this {
        return this.set(0, 0, 0, 1)
    }

    invert(): this {
        return this.conjugate()
    }

    equals(quaternion: Quaternion): boolean {
        return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.w === this.w)
    }

    fromArray(array: number[], offset: number = 0): this {
        this.x = array[offset]
        this.y = array[offset + 1]
        this.z = array[offset + 2]
        this.w = array[offset + 3]
        return this
    }

    toArray(array: number[] = [], offset: number = 0): number[] {
        array[offset] = this.x
        array[offset + 1] = this.y
        array[offset + 2] = this.z
        array[offset + 3] = this.w
        return array
    }
}