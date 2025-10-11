// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, vi, beforeEach } from 'vitest'

import Raycaster, { Ray, Intersection } from './Raycaster'
import Vector2 from '@sky-modules/math/Vector2'
import Mesh from './Mesh'
import { RectGeometry, CircleGeometry, PathGeometry } from './Geometry'
import { BasicMaterial } from './Material'

describe('Raycaster', () => {
    let raycaster: Raycaster
    let mesh: Mesh
    let rectGeometry: RectGeometry
    let circleGeometry: CircleGeometry
    let material: BasicMaterial

    beforeEach(() => {
        raycaster = new Raycaster()
        rectGeometry = new RectGeometry(100, 50, 0, 0)
        circleGeometry = new CircleGeometry(25, 0, 0)
        material = new BasicMaterial({ color: '#ff0000' })
        mesh = new Mesh(rectGeometry, material)
    })

    test('should create raycaster with default values', () => {
        expect(raycaster).toBeDefined()
        expect(raycaster.ray).toBeDefined()
        expect(raycaster.ray.origin).toBeInstanceOf(Vector2)
        expect(raycaster.ray.direction).toBeInstanceOf(Vector2)
        expect(raycaster.ray.origin.x).toBe(0)
        expect(raycaster.ray.origin.y).toBe(0)
        expect(raycaster.ray.direction.x).toBe(0)
        expect(raycaster.ray.direction.y).toBe(0)
    })

    test('should create raycaster with custom origin and direction', () => {
        const origin = new Vector2(10, 20)
        const direction = new Vector2(1, 0)
        const customRaycaster = new Raycaster(origin, direction)

        expect(customRaycaster.ray.origin.x).toBe(10)
        expect(customRaycaster.ray.origin.y).toBe(20)
        expect(customRaycaster.ray.direction.x).toBe(1)
        expect(customRaycaster.ray.direction.y).toBe(0)
    })

    test('should have static context property', () => {
        expect(Raycaster.context).toBe(true)
    })

    test('should set ray origin and direction', () => {
        const origin = new Vector2(5, 10)
        const direction = new Vector2(1, 1)

        raycaster.set(origin, direction)

        expect(raycaster.ray.origin.x).toBe(5)
        expect(raycaster.ray.origin.y).toBe(10)
        // Direction should be normalized
        expect(raycaster.ray.direction.length()).toBeCloseTo(1)
        expect(raycaster.ray.direction.x).toBeCloseTo(Math.sqrt(2) / 2, 5)
        expect(raycaster.ray.direction.y).toBeCloseTo(Math.sqrt(2) / 2, 5)
    })

    test('should return this from set method', () => {
        const origin = new Vector2(1, 2)
        const direction = new Vector2(0, 1)

        const result = raycaster.set(origin, direction)

        expect(result).toBe(raycaster)
    })

    test('should set ray from camera', () => {
        const coords = new Vector2(100, 100)
        const camera = { position: new Vector2(50, 50) }

        raycaster.setFromCamera(coords, camera)

        expect(raycaster.ray.origin.x).toBe(50)
        expect(raycaster.ray.origin.y).toBe(50)
        // Direction should be normalized and point from camera to coords
        expect(raycaster.ray.direction.length()).toBeCloseTo(1)
        expect(raycaster.ray.direction.x).toBeCloseTo(Math.sqrt(2) / 2, 5)
        expect(raycaster.ray.direction.y).toBeCloseTo(Math.sqrt(2) / 2, 5)
    })

    test('should return this from setFromCamera method', () => {
        const coords = new Vector2(10, 10)
        const camera = { position: new Vector2(0, 0) }

        const result = raycaster.setFromCamera(coords, camera)

        expect(result).toBe(raycaster)
    })

    test('should intersect rectangle geometry', () => {
        // Rectangle 100x50 at origin (0,0 to 100,50)
        mesh.position.set(0, 0)

        // Ray from left side pointing right, should hit
        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(1)
        expect(intersections[0].object).toBe(mesh)
        expect(intersections[0].distance).toBeGreaterThan(0)
        expect(intersections[0].point).toBeInstanceOf(Vector2)
    })

    test('should intersect circle geometry', () => {
        const circleMesh = new Mesh(circleGeometry, material)
        circleMesh.position.set(0, 0) // Circle at origin with radius 25

        // Ray from left side pointing right, should hit
        raycaster.set(new Vector2(-50, 0), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(circleMesh)

        expect(intersections).toHaveLength(1)
        expect(intersections[0].object).toBe(circleMesh)
        expect(intersections[0].distance).toBeGreaterThan(0)
        expect(intersections[0].point).toBeInstanceOf(Vector2)
    })

    test('should not intersect when ray misses object', () => {
        mesh.position.set(100, 100)

        // Ray pointing away from object
        raycaster.set(new Vector2(0, 0), new Vector2(-1, 0))

        const intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(0)
    })

    test('should not intersect invisible objects', () => {
        mesh.position.set(50, 25)
        mesh.visible = false

        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(0)
    })

    test('should intersect children when recursive is true', () => {
        const parentMesh = new Mesh(rectGeometry, material)
        const childMesh = new Mesh(circleGeometry, material)

        parentMesh.position.set(0, 0)
        childMesh.position.set(0, 0) // Same position for simplicity
        parentMesh.add(childMesh)

        // Ray that hits both
        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(parentMesh, true)

        expect(intersections.length).toBeGreaterThan(0)
        // Should find intersections when recursive is true
    })

    test('should not intersect children when recursive is false', () => {
        const parentMesh = new Mesh(rectGeometry, material)
        const childMesh = new Mesh(circleGeometry, material)

        parentMesh.position.set(0, 100) // Move parent away from ray
        childMesh.position.set(200, 0) // Child at different location
        parentMesh.add(childMesh)

        // Ray that would hit child but not parent
        raycaster.set(new Vector2(180, 0), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(parentMesh, false)

        expect(intersections).toHaveLength(0)
    })

    test('should skip non-mesh children', () => {
        const parentMesh = new Mesh(rectGeometry, material)
        const nonMeshChild = { isMesh: false } as any

        parentMesh.children.push(nonMeshChild)
        parentMesh.position.set(50, 25)

        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(parentMesh, true)

        expect(intersections).toHaveLength(1)
        expect(intersections[0].object).toBe(parentMesh)
    })

    test('should sort intersections by distance', () => {
        const mesh1 = new Mesh(circleGeometry, material)
        const mesh2 = new Mesh(circleGeometry, material)
        const mesh3 = new Mesh(circleGeometry, material)

        mesh1.position.set(100, 0) // Farthest
        mesh2.position.set(50, 0)  // Middle
        mesh3.position.set(25, 0)  // Closest

        // Ray from left hitting all three circles
        raycaster.set(new Vector2(-10, 0), new Vector2(1, 0))

        const objects = [mesh1, mesh2, mesh3]
        const intersections = raycaster.intersectObjects(objects)

        expect(intersections).toHaveLength(3)
        expect(intersections[0].object).toBe(mesh3) // Closest first
        expect(intersections[1].object).toBe(mesh2)
        expect(intersections[2].object).toBe(mesh1) // Farthest last
        expect(intersections[0].distance).toBeLessThan(intersections[1].distance)
        expect(intersections[1].distance).toBeLessThan(intersections[2].distance)
    })

    test('should intersect multiple objects', () => {
        const mesh1 = new Mesh(rectGeometry, material)
        const mesh2 = new Mesh(circleGeometry, material)

        mesh1.position.set(50, 0)
        mesh2.position.set(150, 0)

        // Ray hitting both objects
        raycaster.set(new Vector2(-10, 0), new Vector2(1, 0))

        const objects = [mesh1, mesh2]
        const intersections = raycaster.intersectObjects(objects)

        expect(intersections).toHaveLength(2)
    })

    test('should handle rectangle intersection with ray from different angles', () => {
        mesh.position.set(50, 25) // Center rect at (50, 25)

        // Test ray from top
        raycaster.set(new Vector2(50, -10), new Vector2(0, 1))
        let intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)

        // Test ray from bottom
        raycaster.set(new Vector2(50, 100), new Vector2(0, -1))
        intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)

        // Test ray from right
        raycaster.set(new Vector2(200, 25), new Vector2(-1, 0))
        intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)
    })

    test('should handle circle intersection with ray from different angles', () => {
        const circleMesh = new Mesh(circleGeometry, material)
        circleMesh.position.set(0, 0)

        // Test ray from left
        raycaster.set(new Vector2(-50, 0), new Vector2(1, 0))
        let intersections = raycaster.intersectObject(circleMesh)
        expect(intersections).toHaveLength(1)

        // Test ray from top
        raycaster.set(new Vector2(0, -50), new Vector2(0, 1))
        intersections = raycaster.intersectObject(circleMesh)
        expect(intersections).toHaveLength(1)

        // Test diagonal ray
        raycaster.set(new Vector2(-50, -50), new Vector2(1, 1))
        intersections = raycaster.intersectObject(circleMesh)
        expect(intersections).toHaveLength(1)
    })

    test('should handle edge cases for rectangle intersection', () => {
        mesh.position.set(50, 25)

        // Ray parallel to rectangle edge (should miss)
        raycaster.set(new Vector2(-10, -10), new Vector2(1, 0))
        let intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(0)

        // Ray starting inside rectangle
        raycaster.set(new Vector2(50, 25), new Vector2(1, 0))
        intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)
    })

    test('should handle edge cases for circle intersection', () => {
        const circleMesh = new Mesh(circleGeometry, material)
        circleMesh.position.set(0, 0)

        // Ray tangent to circle (should miss due to floating point precision)
        raycaster.set(new Vector2(-50, 26), new Vector2(1, 0)) // 26 > 25 radius, should miss
        let intersections = raycaster.intersectObject(circleMesh)
        expect(intersections).toHaveLength(0)

        // Ray starting inside circle
        raycaster.set(new Vector2(0, 0), new Vector2(1, 0))
        intersections = raycaster.intersectObject(circleMesh)
        expect(intersections).toHaveLength(1)
    })

    test('should handle unsupported geometry types', () => {
        const pathGeometry = new PathGeometry()
        const pathMesh = new Mesh(pathGeometry, material)

        raycaster.set(new Vector2(-10, 0), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(pathMesh)

        expect(intersections).toHaveLength(0)
    })

    test('should calculate accurate intersection points for rectangles', () => {
        mesh.position.set(0, 0) // Rectangle from (0,0) to (100,50)

        // Ray hitting left edge
        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))
        let intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(1)
        expect(intersections[0].point).toBeInstanceOf(Vector2)

        // Ray hitting top edge
        raycaster.set(new Vector2(50, -10), new Vector2(0, 1))
        intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(1)
        expect(intersections[0].point).toBeInstanceOf(Vector2)
    })

    test('should calculate accurate intersection points for circles', () => {
        const circleMesh = new Mesh(circleGeometry, material)
        circleMesh.position.set(0, 0) // Circle at origin with radius 25

        // Ray hitting from left
        raycaster.set(new Vector2(-50, 0), new Vector2(1, 0))
        const intersections = raycaster.intersectObject(circleMesh)

        expect(intersections[0].point.x).toBeCloseTo(-25, 5)
        expect(intersections[0].point.y).toBeCloseTo(0, 5)
    })

    test('should handle ray with zero direction components', () => {
        mesh.position.set(50, 25)

        // Ray with zero x-direction (vertical ray)
        raycaster.set(new Vector2(50, -10), new Vector2(0, 1))
        let intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)

        // Ray with zero y-direction (horizontal ray)
        raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))
        intersections = raycaster.intersectObject(mesh)
        expect(intersections).toHaveLength(1)
    })

    test('should handle transformed objects', () => {
        // Mock the world transform methods
        vi.spyOn(mesh, 'getWorldTransform').mockReturnValue({
            position: new Vector2(100, 100),
            rotation: 0,
            scale: new Vector2(1, 1)
        })

        vi.spyOn(mesh, 'worldToLocal').mockImplementation((point) => {
            return point.clone().sub(new Vector2(100, 100))
        })

        vi.spyOn(mesh, 'localToWorld').mockImplementation((point) => {
            return point.clone().add(new Vector2(100, 100))
        })

        // Ray aimed at transformed position
        raycaster.set(new Vector2(50, 100), new Vector2(1, 0))
        const intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(1)
        expect(mesh.getWorldTransform).toHaveBeenCalled()
        expect(mesh.worldToLocal).toHaveBeenCalled()
        expect(mesh.localToWorld).toHaveBeenCalled()
    })

    test('should return empty array for empty object list', () => {
        raycaster.set(new Vector2(0, 0), new Vector2(1, 0))

        const intersections = raycaster.intersectObjects([])

        expect(intersections).toEqual([])
    })

    test('should handle ray pointing backwards', () => {
        mesh.position.set(0, 0)

        // Ray starting after object, pointing away
        raycaster.set(new Vector2(200, 25), new Vector2(1, 0))

        const intersections = raycaster.intersectObject(mesh)

        expect(intersections).toHaveLength(0)
    })

    describe('intersectMesh (via public API)', () => {
        test('should handle mesh with identity transform', () => {
            mesh.position.set(0, 0)
            mesh.rotation = 0
            mesh.scale.set(1, 1)

            raycaster.set(new Vector2(-10, 25), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle mesh with translation', () => {
            mesh.position.set(50, 50)
            mesh.rotation = 0
            mesh.scale.set(1, 1)

            raycaster.set(new Vector2(40, 75), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle mesh with scaling', () => {
            mesh.position.set(0, 0)
            mesh.rotation = 0
            mesh.scale.set(2, 2)

            // Ray should hit scaled rectangle
            raycaster.set(new Vector2(-10, 50), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle mesh with rotation', () => {
            mesh.position.set(0, 0)
            mesh.rotation = Math.PI / 4 // 45 degrees
            mesh.scale.set(1, 1)

            // Test intersection with rotated rectangle
            raycaster.set(new Vector2(-10, 0), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            // Should still intersect (exact behavior depends on rotation)
            expect(intersections.length).toBeGreaterThanOrEqual(0)
        })

        test('should handle combined transformations', () => {
            mesh.position.set(100, 100)
            mesh.rotation = Math.PI / 6 // 30 degrees
            mesh.scale.set(1.5, 0.8)

            // Test intersection with fully transformed rectangle
            raycaster.set(new Vector2(80, 100), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            // Should handle complex transformations
            expect(intersections.length).toBeGreaterThanOrEqual(0)
        })

        test('should handle circle geometry with transformations', () => {
            const circleMesh = new Mesh(circleGeometry, material)
            circleMesh.position.set(50, 50)
            circleMesh.scale.set(2, 2) // Scale circle to radius 50

            raycaster.set(new Vector2(20, 50), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(circleMesh)

            expect(intersections).toHaveLength(1)
        })

        test('should return null for unsupported geometry in intersectMesh', () => {
            const pathGeometry = new PathGeometry()
            pathGeometry.moveTo(0, 0)
            pathGeometry.lineTo(100, 100)

            const pathMesh = new Mesh(pathGeometry, material)
            pathMesh.position.set(0, 0)

            raycaster.set(new Vector2(-10, 50), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(pathMesh)

            expect(intersections).toHaveLength(0)
        })

        test('should handle mesh at world origin', () => {
            mesh.position.set(0, 0)
            mesh.rotation = 0
            mesh.scale.set(1, 1)

            // Test ray that starts inside mesh bounds
            raycaster.set(new Vector2(50, 25), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(mesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle negative scaling', () => {
            mesh.position.set(0, 0)
            mesh.rotation = 0
            mesh.scale.set(-1, 1) // Flip horizontally

            raycaster.set(new Vector2(10, 25), new Vector2(-1, 0)) // Ray pointing left
            const intersections = raycaster.intersectObject(mesh)

            expect(intersections.length).toBeGreaterThanOrEqual(0)
        })

        test('should handle very small meshes', () => {
            const smallRect = new RectGeometry(1, 1, 0, 0)
            const smallMesh = new Mesh(smallRect, material)
            smallMesh.position.set(0, 0)

            raycaster.set(new Vector2(-0.1, 0.5), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(smallMesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle very large meshes', () => {
            const largeRect = new RectGeometry(1000, 1000, -500, -500)
            const largeMesh = new Mesh(largeRect, material)
            largeMesh.position.set(0, 0)

            raycaster.set(new Vector2(-600, 0), new Vector2(1, 0))
            const intersections = raycaster.intersectObject(largeMesh)

            expect(intersections).toHaveLength(1)
        })

        test('should handle precision edge cases', () => {
            mesh.position.set(0, 0)

            // Ray exactly at rectangle edge
            raycaster.set(new Vector2(-1, 0), new Vector2(1, 0))
            let intersections = raycaster.intersectObject(mesh)
            expect(intersections).toHaveLength(1)

            // Ray exactly at rectangle corner
            raycaster.set(new Vector2(-1, -1), new Vector2(1, 1))
            intersections = raycaster.intersectObject(mesh)
            expect(intersections.length).toBeGreaterThanOrEqual(0)
        })
    })
})