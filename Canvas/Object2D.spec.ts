// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach } from 'vitest'

import Object2D from './Object2D'

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
})