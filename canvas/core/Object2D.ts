import { Matrix3 } from '@sky-modules/math/three/Matrix3'
import { Quaternion } from '@sky-modules/math/three/Quaternion'
import Vector2 from '@sky-modules/math/Vector2'

export interface Transform2D {
    position: Vector2
    rotation: number
    scale: Vector2
}

export default class Object2D {
    static context = true

    position: Vector2 = new Vector2(0, 0)
    rotation: number = 0
    scale: Vector2 = new Vector2(1, 1)
    visible: boolean = true
    children: Object2D[] = []
    parent: Object2D | null = null
    id?: string
    name?: string

    // Matrix properties like Three.js
    matrix: Matrix3 = new Matrix3()
    matrixWorld: Matrix3 = new Matrix3()
    matrixAutoUpdate: boolean = true
    matrixWorldNeedsUpdate: boolean = true

    // Quaternion support (for 2D rotation around Z-axis)
    quaternion: Quaternion = new Quaternion()
    useQuaternion: boolean = false

    add(object: Object2D): this {
        if (object.parent) {
            object.parent.remove(object)
        }

        object.parent = this
        this.children.push(object)
        return this
    }

    remove(object: Object2D): this {
        const index = this.children.indexOf(object)

        if (index !== -1) {
            this.children.splice(index, 1)
            object.parent = null
        }

        return this
    }

    setPosition(x: number, y: number): this {
        this.position.set(x, y)
        return this
    }

    setRotation(rotation: number): this {
        this.rotation = rotation
        return this
    }

    setScale(x: number, y: number): this {
        this.scale.set(x, y)
        return this
    }

    setVisible(visible: boolean): this {
        this.visible = visible
        return this
    }

    getWorldTransform(): Transform2D {
        let worldTransform: Transform2D = {
            position: this.position.clone(),
            rotation: this.rotation,
            scale: this.scale.clone(),
        }

        if (this.parent) {
            const parentTransform = this.parent.getWorldTransform()

            // Apply parent scale
            worldTransform.position.multiply(parentTransform.scale)
            worldTransform.scale.multiply(parentTransform.scale)

            // Apply parent rotation
            worldTransform.position.rotateAround(new Vector2(0, 0), parentTransform.rotation)
            worldTransform.rotation += parentTransform.rotation

            // Apply parent position
            worldTransform.position.add(parentTransform.position)
        }

        return worldTransform
    }

    traverse(callback: (object: Object2D) => void): void {
        callback(this)

        for (const child of this.children) {
            child.traverse(callback)
        }
    }

    // Matrix methods like Three.js
    updateMatrix(): this {
        // Compose 2D transformation matrix manually
        this.matrix.identity()
        this.matrix.translate(this.position.x, this.position.y)
        this.matrix.rotate(this.rotation)
        this.matrix.scale(this.scale.x, this.scale.y)
        this.matrixWorldNeedsUpdate = true
        return this
    }

    updateMatrixWorld(force: boolean = false): this {
        if (this.matrixAutoUpdate) this.updateMatrix()

        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix)
            } else {
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
            }

            this.matrixWorldNeedsUpdate = false
            force = true
        }

        // Update children
        for (const child of this.children) {
            child.updateMatrixWorld(force)
        }

        return this
    }

    applyMatrix3(matrix: Matrix3): this {
        this.matrix.premultiply(matrix)
        // Extract transformation from matrix (simplified for 2D)
        const elements = this.matrix.elements
        this.position.set(elements[6], elements[7])
        this.scale.set(
            Math.sqrt(elements[0] * elements[0] + elements[1] * elements[1]),
            Math.sqrt(elements[3] * elements[3] + elements[4] * elements[4])
        )
        this.rotation = Math.atan2(elements[1], elements[0])
        return this
    }

    // Additional methods like Three.js
    translateX(distance: number): this {
        this.position.x += distance
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    translateY(distance: number): this {
        this.position.y += distance
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    rotateZ(angle: number): this {
        this.rotation += angle
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    lookAt(x: number, y: number): this {
        const angle = Math.atan2(y - this.position.y, x - this.position.x)
        this.rotation = angle
        if (this.matrixAutoUpdate) this.matrixWorldNeedsUpdate = true
        return this
    }

    getWorldPosition(): Vector2 {
        return this.getWorldTransform().position
    }

    getWorldRotation(): number {
        return this.getWorldTransform().rotation
    }

    getWorldScale(): Vector2 {
        return this.getWorldTransform().scale
    }

    localToWorld(localPoint: Vector2): Vector2 {
        const transform = this.getWorldTransform()
        const rotated = localPoint.clone().rotateAround(new Vector2(0, 0), transform.rotation)
        return rotated.multiply(transform.scale).add(transform.position)
    }

    worldToLocal(worldPoint: Vector2): Vector2 {
        const transform = this.getWorldTransform()
        const local = worldPoint.clone().sub(transform.position)
        local.divide(transform.scale)
        return local.rotateAround(new Vector2(0, 0), -transform.rotation)
    }

    traverseVisible(callback: (object: Object2D) => void): void {
        if (!this.visible) return

        callback(this)

        for (const child of this.children) {
            if (child.visible) {
                child.traverseVisible(callback)
            }
        }
    }

    traverseAncestors(callback: (object: Object2D) => void): void {
        if (this.parent) {
            callback(this.parent)
            this.parent.traverseAncestors(callback)
        }
    }

    getObjectById(id: string): Object2D | undefined {
        if (this.id === id) return this

        for (const child of this.children) {
            const found = child.getObjectById(id)
            if (found) return found
        }

        return undefined
    }

    getObjectByName(name: string): Object2D | undefined {
        if (this.name === name) return this

        for (const child of this.children) {
            const found = child.getObjectByName(name)
            if (found) return found
        }

        return undefined
    }

    clone(): Object2D {
        const cloned = new Object2D()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        return cloned
    }
}
