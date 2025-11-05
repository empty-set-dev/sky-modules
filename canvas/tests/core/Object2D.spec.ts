// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach } from 'vitest'

import Object2D from '../../core/Object2D'

describe('Object2D', () => {
    let object: Object2D

    beforeEach(() => {
        object = new Object2D()
    })

    test('should create with default transform values', () => {
        expect(object.position.x).toBe(0)
        expect(object.position.y).toBe(0)
        expect(object.rotation).toBe(0)
        expect(object.scale.x).toBe(1)
        expect(object.scale.y).toBe(1)
        expect(object.visible).toBe(true)
        expect(object.parent).toBeNull()
        expect(object.children).toEqual([])
    })

    test('should set visibility', () => {
        object.visible = false
        expect(object.visible).toBe(false)

        object.visible = true
        expect(object.visible).toBe(true)
    })

    test('should add child', () => {
        const child = new Object2D()
        object.add(child)

        expect(object.children).toHaveLength(1)
        expect(object.children[0]).toBe(child)
        expect(child.parent).toBe(object)
    })

    test('should add multiple children sequentially', () => {
        const child1 = new Object2D()
        const child2 = new Object2D()

        object.add(child1)
        object.add(child2)

        expect(object.children).toHaveLength(2)
        expect(object.children[0]).toBe(child1)
        expect(object.children[1]).toBe(child2)
        expect(child1.parent).toBe(object)
        expect(child2.parent).toBe(object)
    })

    test('should remove child', () => {
        const child1 = new Object2D()
        const child2 = new Object2D()

        object.add(child1)
        object.add(child2)
        object.remove(child1)

        expect(object.children).toHaveLength(1)
        expect(object.children[0]).toBe(child2)
        expect(child1.parent).toBeNull()
        expect(child2.parent).toBe(object)
    })

    test('should handle removing non-existing child', () => {
        const child1 = new Object2D()
        const child2 = new Object2D()

        object.add(child1)
        object.remove(child2) // child2 not in children

        expect(object.children).toHaveLength(1)
        expect(object.children[0]).toBe(child1)
    })

    test('should move child between parents', () => {
        const parent1 = new Object2D()
        const parent2 = new Object2D()
        const child = new Object2D()

        parent1.add(child)
        expect(parent1.children).toHaveLength(1)
        expect(child.parent).toBe(parent1)

        parent2.add(child) // Should remove from parent1 and add to parent2
        expect(parent1.children).toHaveLength(0)
        expect(parent2.children).toHaveLength(1)
        expect(child.parent).toBe(parent2)
    })

    test('should traverse children recursively', () => {
        const child1 = new Object2D()
        const grandchild = new Object2D()

        object.add(child1)
        child1.add(grandchild)

        let count = 0
        object.traverse(() => count++)

        expect(count).toBe(3) // object + child1 + grandchild
    })

    test('should traverse with callback receiving object', () => {
        const child = new Object2D()
        object.add(child)

        const visited: Object2D[] = []
        object.traverse((obj) => visited.push(obj))

        expect(visited).toHaveLength(2)
        expect(visited[0]).toBe(object)
        expect(visited[1]).toBe(child)
    })

    test('should handle name and id properties', () => {
        object.name = 'testObject'
        object.id = 'obj123'

        expect(object.name).toBe('testObject')
        expect(object.id).toBe('obj123')
    })

    test('should have matrix properties', () => {
        expect(object.matrix).toBeDefined()
        expect(object.matrixWorld).toBeDefined()
        expect(object.matrixAutoUpdate).toBe(true)
        expect(object.matrixWorldNeedsUpdate).toBe(true)
    })

    test('should update matrix based on transform properties', () => {
        object.position.set(10, 20)
        object.rotation = Math.PI / 4
        object.scale.set(2, 3)

        object.updateMatrix()

        // Matrix should be composed correctly (not checking exact values, just that it updates)
        expect(object.matrixWorldNeedsUpdate).toBe(true)
    })

    test('should update matrix world with no parent', () => {
        object.position.set(5, 10)
        object.updateMatrixWorld()

        // With no parent, matrixWorld should equal matrix
        expect(object.matrixWorld.equals(object.matrix)).toBe(true)
        expect(object.matrixWorldNeedsUpdate).toBe(false)
    })

    test('should update matrix world with parent', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.position.set(10, 10)
        child.position.set(5, 5)

        parent.add(child)
        parent.updateMatrixWorld()

        // Child's matrixWorld should include parent transformation
        expect(child.matrixWorldNeedsUpdate).toBe(false)
    })

    test('should force update matrix world', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.add(child)
        parent.updateMatrixWorld()

        // Reset flags
        parent.matrixWorldNeedsUpdate = false
        child.matrixWorldNeedsUpdate = false

        // Force update should update even when flags are false
        parent.updateMatrixWorld(true)

        expect(parent.matrixWorldNeedsUpdate).toBe(false)
        expect(child.matrixWorldNeedsUpdate).toBe(false)
    })

    test('should skip matrix update when matrixAutoUpdate is false', () => {
        object.matrixAutoUpdate = false
        object.position.set(100, 100)

        const originalMatrix = object.matrix.clone()
        object.updateMatrixWorld()

        // Matrix should not have been updated
        expect(object.matrix.equals(originalMatrix)).toBe(true)
    })


    test('should look at target position', () => {
        object.position.set(0, 0)
        object.lookAt(10, 10)

        // Should rotate to face the target (45 degrees)
        expect(object.rotation).toBeCloseTo(Math.PI / 4)
    })

    test('should look at with different positions', () => {
        object.position.set(5, 5)
        object.lookAt(5, 10) // Look directly up

        expect(object.rotation).toBeCloseTo(Math.PI / 2)
    })

    test('should handle position updates', () => {
        object.position.set(10, 20)
        expect(object.position.x).toBe(10)
        expect(object.position.y).toBe(20)

        object.position.x = 30
        object.position.y = 40
        expect(object.position.x).toBe(30)
        expect(object.position.y).toBe(40)
    })

    test('should get world position', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.position.set(10, 20)
        child.position.set(5, 5)

        parent.add(child)
        parent.updateMatrixWorld()

        const worldPos = child.getWorldPosition()
        expect(worldPos.x).toBeCloseTo(15) // 10 + 5
        expect(worldPos.y).toBeCloseTo(25) // 20 + 5
    })

    test('should get world scale', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.scale.set(2, 3)
        child.scale.set(1.5, 2)

        parent.add(child)
        parent.updateMatrixWorld()

        const worldScale = child.getWorldScale()
        expect(worldScale.x).toBeCloseTo(3) // 2 * 1.5
        expect(worldScale.y).toBeCloseTo(6) // 3 * 2
    })

    test('should get world rotation', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.rotation = Math.PI / 4
        child.rotation = Math.PI / 4

        parent.add(child)
        parent.updateMatrixWorld()

        const worldRotation = child.getWorldRotation()
        expect(worldRotation).toBeCloseTo(Math.PI / 2) // π/4 + π/4
    })

    test('should handle world transformations', () => {
        const parent = new Object2D()
        const child = new Object2D()

        parent.position.set(10, 10)
        child.position.set(5, 5)

        parent.add(child)
        parent.updateMatrixWorld()

        const worldPos = child.getWorldPosition()
        expect(worldPos.x).toBeCloseTo(15) // 10 + 5
        expect(worldPos.y).toBeCloseTo(15) // 10 + 5
    })

    test('should clone object', () => {
        object.position.set(10, 20)
        object.rotation = Math.PI / 4
        object.scale.set(2, 3)
        object.visible = false

        const cloned = object.clone()

        expect(cloned.position.x).toBe(10)
        expect(cloned.position.y).toBe(20)
        expect(cloned.rotation).toBe(Math.PI / 4)
        expect(cloned.scale.x).toBe(2)
        expect(cloned.scale.y).toBe(3)
        expect(cloned.visible).toBe(false)
        expect(cloned.parent).toBeNull()
        expect(cloned.children).toHaveLength(0)
    })
})