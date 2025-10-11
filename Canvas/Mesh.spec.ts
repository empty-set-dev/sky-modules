// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, vi, beforeEach } from 'vitest'

import Mesh from './Mesh'
import { RectGeometry, CircleGeometry, PathGeometry } from './Geometry'
import { BasicMaterial, StrokeMaterial, GradientMaterial } from './Material'

describe('Mesh', () => {
    let mesh: Mesh
    let geometry: RectGeometry
    let material: BasicMaterial

    beforeEach(() => {
        geometry = new RectGeometry(100, 50, 10, 20)
        material = new BasicMaterial({ color: '#ff0000' })
        mesh = new Mesh(geometry, material)
    })

    test('should create mesh with geometry and material', () => {
        expect(mesh).toBeDefined()
        expect(mesh.geometry).toBe(geometry)
        expect(mesh.material).toBe(material)
        expect(mesh.isMesh).toBe(true)
    })

    test('should inherit from Object2D', () => {
        expect(mesh.position).toBeDefined()
        expect(mesh.rotation).toBe(0)
        expect(mesh.scale).toBeDefined()
        expect(mesh.visible).toBe(true)
        expect(mesh.children).toEqual([])
        expect(mesh.parent).toBeNull()
    })

    test('should have static context property', () => {
        expect(Mesh.context).toBe(true)
    })

    test('should render with different geometries', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const saveSpy = vi.spyOn(ctx, 'save')
        const restoreSpy = vi.spyOn(ctx, 'restore')
        const beginPathSpy = vi.spyOn(ctx, 'beginPath')

        // Test with RectGeometry
        mesh.render(ctx, 1)
        expect(saveSpy).toHaveBeenCalled()
        expect(beginPathSpy).toHaveBeenCalled()
        expect(restoreSpy).toHaveBeenCalled()

        // Test with CircleGeometry
        const circleGeometry = new CircleGeometry(25, 0, 0)
        const circleMesh = new Mesh(circleGeometry, material)
        circleMesh.render(ctx, 1)

        // Test with PathGeometry
        const pathGeometry = new PathGeometry()
        pathGeometry.moveTo(0, 0)
        pathGeometry.lineTo(50, 50)
        const pathMesh = new Mesh(pathGeometry, material)
        pathMesh.render(ctx, 1)
    })

    test('should render with different materials', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // Test with BasicMaterial
        const basicMesh = new Mesh(geometry, new BasicMaterial({ color: '#00ff00' }))
        basicMesh.render(ctx, 1)

        // Test with StrokeMaterial
        const strokeMesh = new Mesh(geometry, new StrokeMaterial({ color: '#0000ff', lineWidth: 3 }))
        strokeMesh.render(ctx, 1)

        // Test with GradientMaterial
        const gradient = ctx.createLinearGradient(0, 0, 100, 100)
        gradient.addColorStop(0, '#ff0000')
        gradient.addColorStop(1, '#00ff00')
        const gradientMesh = new Mesh(geometry, new GradientMaterial({ gradient }))
        gradientMesh.render(ctx, 1)
    })

    test('should apply transformations during render', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const translateSpy = vi.spyOn(ctx, 'translate')
        const rotateSpy = vi.spyOn(ctx, 'rotate')
        const scaleSpy = vi.spyOn(ctx, 'scale')

        mesh.position.set(100, 200)
        mesh.rotation = Math.PI / 4
        mesh.scale.set(2, 3)

        mesh.render(ctx, 1)

        expect(translateSpy).toHaveBeenCalledWith(100, 200)
        expect(rotateSpy).toHaveBeenCalledWith(Math.PI / 4)
        expect(scaleSpy).toHaveBeenCalledWith(2, 3)
    })

    test('should handle pixelRatio in transformations', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const translateSpy = vi.spyOn(ctx, 'translate')

        mesh.position.set(50, 75)
        mesh.render(ctx, 2)

        expect(translateSpy).toHaveBeenCalledWith(100, 150) // 50*2, 75*2
    })

    test('should not render when not visible', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const saveSpy = vi.spyOn(ctx, 'save')

        mesh.visible = false
        mesh.render(ctx, 1)

        expect(saveSpy).not.toHaveBeenCalled()
    })

    test('should render children recursively', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const childGeometry = new CircleGeometry(25)
        const childMaterial = new BasicMaterial({ color: '#00ff00' })
        const childMesh = new Mesh(childGeometry, childMaterial)

        const childRenderSpy = vi.spyOn(childMesh, 'render')

        mesh.add(childMesh)
        mesh.render(ctx, 1)

        expect(childRenderSpy).toHaveBeenCalledWith(ctx, 1)
    })

    test('should skip non-mesh children during render', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const nonMeshChild = { isMesh: false, render: vi.fn() } as any
        mesh.children.push(nonMeshChild)

        mesh.render(ctx, 1)

        expect(nonMeshChild.render).not.toHaveBeenCalled()
    })

    test('should handle rotation optimization', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const rotateSpy = vi.spyOn(ctx, 'rotate')

        // No rotation - should not call rotate
        mesh.rotation = 0
        mesh.render(ctx, 1)
        expect(rotateSpy).not.toHaveBeenCalled()

        // With rotation - should call rotate
        mesh.rotation = Math.PI / 2
        mesh.render(ctx, 1)
        expect(rotateSpy).toHaveBeenCalledWith(Math.PI / 2)
    })

    test('should handle scale optimization', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const scaleSpy = vi.spyOn(ctx, 'scale')

        // Default scale - should not call scale
        mesh.scale.set(1, 1)
        mesh.render(ctx, 1)
        expect(scaleSpy).not.toHaveBeenCalled()

        // Custom scale - should call scale
        mesh.scale.set(1.5, 2.5)
        mesh.render(ctx, 1)
        expect(scaleSpy).toHaveBeenCalledWith(1.5, 2.5)
    })

    test('should call material apply and render methods', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const applySpy = vi.spyOn(material, 'apply')
        const renderSpy = vi.spyOn(material, 'render')

        mesh.render(ctx, 2)

        expect(applySpy).toHaveBeenCalledWith(ctx, 2)
        expect(renderSpy).toHaveBeenCalledWith(ctx)
    })

    test('should call geometry draw method', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const drawSpy = vi.spyOn(geometry, 'draw')

        mesh.render(ctx, 2)

        expect(drawSpy).toHaveBeenCalledWith(ctx, 2)
    })

    test('should handle raycast method', () => {
        const mockRaycaster = {
            intersectMesh: vi.fn(() => ({ mesh, distance: 10, point: [50, 50] }))
        }
        const intersects: any[] = []

        mesh.raycast(mockRaycaster, intersects)

        expect(mockRaycaster.intersectMesh).toHaveBeenCalledWith(mesh)
        expect(intersects).toHaveLength(1)
        expect(intersects[0]).toEqual({ mesh, distance: 10, point: [50, 50] })
    })

    test('should handle raycast with no intersection', () => {
        const mockRaycaster = {
            intersectMesh: vi.fn(() => null)
        }
        const intersects: any[] = []

        mesh.raycast(mockRaycaster, intersects)

        expect(mockRaycaster.intersectMesh).toHaveBeenCalledWith(mesh)
        expect(intersects).toHaveLength(0)
    })

    test('should handle raycast without intersectMesh method', () => {
        const mockRaycaster = {}
        const intersects: any[] = []

        expect(() => {
            mesh.raycast(mockRaycaster, intersects)
        }).not.toThrow()

        expect(intersects).toHaveLength(0)
    })

    test('should clone mesh with all properties', () => {
        mesh.position.set(100, 200)
        mesh.rotation = Math.PI / 3
        mesh.scale.set(1.5, 2.0)
        mesh.visible = false
        mesh.id = 'test-mesh'
        mesh.name = 'MyMesh'

        const cloned = mesh.clone()

        expect(cloned).not.toBe(mesh)
        expect(cloned.geometry).toBe(geometry) // Same reference
        expect(cloned.material).toBe(material) // Same reference
        expect(cloned.position.x).toBe(100)
        expect(cloned.position.y).toBe(200)
        expect(cloned.rotation).toBe(Math.PI / 3)
        expect(cloned.scale.x).toBe(1.5)
        expect(cloned.scale.y).toBe(2.0)
        expect(cloned.visible).toBe(false)
        expect(cloned.id).toBe('test-mesh')
        expect(cloned.name).toBe('MyMesh')
    })

    test('should clone mesh without optional properties', () => {
        // Don't set id and name
        const cloned = mesh.clone()

        expect(cloned.id).toBeUndefined()
        expect(cloned.name).toBeUndefined()
    })

    test('should handle world transform calculation', () => {
        const parentMesh = new Mesh(geometry, material)
        parentMesh.position.set(50, 50)
        parentMesh.rotation = Math.PI / 4
        parentMesh.scale.set(2, 2)

        mesh.position.set(25, 25)
        parentMesh.add(mesh)

        const transform = mesh.getWorldTransform()

        // Should include parent transformations
        expect(transform).toBeDefined()
        expect(transform.position).toBeDefined()
        expect(transform.rotation).toBeDefined()
        expect(transform.scale).toBeDefined()
    })

    test('should handle complex nested transformations', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const grandparent = new Mesh(geometry, material)
        const parent = new Mesh(geometry, material)

        grandparent.position.set(10, 10)
        grandparent.rotation = Math.PI / 6

        parent.position.set(20, 20)
        parent.rotation = Math.PI / 4

        mesh.position.set(30, 30)

        grandparent.add(parent)
        parent.add(mesh)

        const renderSpy = vi.spyOn(ctx, 'save')

        grandparent.render(ctx, 1)

        expect(renderSpy).toHaveBeenCalled()
    })
})