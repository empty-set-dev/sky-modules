// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

import Canvas from './Canvas'
import { RectGeometry, CircleGeometry } from './Geometry'
import Group from './Group'
import { BasicMaterial, StrokeMaterial } from './Material'
import Mesh from './Mesh'
import Scene from './Scene'

describe('Canvas', () => {
    let canvas: Canvas
    let scene: Scene

    beforeEach(() => {
        canvas = new Canvas({
            size: () => [800, 600],
        })
        scene = new Scene()
    })

    afterEach(() => {
        canvas.dispose?.()
    })

    test('should create canvas with specified size', () => {
        expect(canvas).toBeDefined()
        expect(canvas.domElement).toBeDefined()
        expect(canvas.domElement.tagName).toBe('CANVAS')
        expect(canvas.domElement.width).toBe(800)
        expect(canvas.domElement.height).toBe(600)
    })

    test('should render scene to canvas', () => {
        const rect = new RectGeometry(100, 100, 0, 0)
        const material = new BasicMaterial({ color: '#ff0000' })
        const mesh = new Mesh(rect, material)

        scene.add(mesh)
        canvas.render(scene)

        // Canvas should have rendered content
        expect(canvas.domElement.getContext('2d')).toBeDefined()
    })

    test('should handle resize', () => {
        canvas.onResize()
        expect(canvas.domElement.width).toBe(800)
        expect(canvas.domElement.height).toBe(600)
    })
})

describe('Scene', () => {
    let scene: Scene

    beforeEach(() => {
        scene = new Scene()
    })

    test('should create empty scene', () => {
        expect(scene).toBeDefined()
        expect(scene.children).toHaveLength(0)
    })

    test('should add and remove objects', () => {
        const rect = new RectGeometry(100, 100)
        const material = new BasicMaterial({ color: '#ff0000' })
        const mesh = new Mesh(rect, material)

        scene.add(mesh)
        expect(scene.children).toHaveLength(1)
        expect(mesh.parent).toBe(scene)

        scene.remove(mesh)
        expect(scene.children).toHaveLength(0)
        expect(mesh.parent).toBeNull()
    })

    test('should set background', () => {
        scene.setBackground('#ff0000')
        expect(scene.background).toBe('#ff0000')
    })
})

describe('Mesh', () => {
    let mesh: Mesh
    let geometry: RectGeometry
    let material: BasicMaterial

    beforeEach(() => {
        geometry = new RectGeometry(100, 100)
        material = new BasicMaterial({ color: '#ff0000' })
        mesh = new Mesh(geometry, material)
    })

    test('should create mesh with geometry and material', () => {
        expect(mesh).toBeDefined()
        expect(mesh.geometry).toBe(geometry)
        expect(mesh.material).toBe(material)
        expect(mesh.isMesh).toBe(true)
    })

    test('should have transform properties', () => {
        expect(mesh.position).toBeDefined()
        expect(mesh.rotation).toBe(0)
        expect(mesh.scale).toBeDefined()
        expect(mesh.visible).toBe(true)
    })

    test('should update transform properties', () => {
        mesh.position.set(100, 200)
        mesh.rotation = Math.PI / 4
        mesh.scale.set(2, 2)
        mesh.visible = false

        expect(mesh.position.x).toBe(100)
        expect(mesh.position.y).toBe(200)
        expect(mesh.rotation).toBe(Math.PI / 4)
        expect(mesh.scale.x).toBe(2)
        expect(mesh.scale.y).toBe(2)
        expect(mesh.visible).toBe(false)
    })

    test('should clone mesh', () => {
        mesh.position.set(100, 200)
        mesh.rotation = Math.PI / 4

        const cloned = mesh.clone()

        expect(cloned).not.toBe(mesh)
        expect(cloned.geometry).toBe(geometry)
        expect(cloned.material).toBe(material)
        expect(cloned.position.x).toBe(100)
        expect(cloned.position.y).toBe(200)
        expect(cloned.rotation).toBe(Math.PI / 4)
    })
})

describe('Group', () => {
    let group: Group

    beforeEach(() => {
        group = new Group()
    })

    test('should create empty group', () => {
        expect(group).toBeDefined()
        expect(group.isGroup).toBe(true)
        expect(group.children).toHaveLength(0)
    })

    test('should add and remove meshes', () => {
        const rect = new RectGeometry(100, 100)
        const material = new BasicMaterial({ color: '#ff0000' })
        const mesh = new Mesh(rect, material)

        group.add(mesh)
        expect(group.children).toHaveLength(1)
        expect(mesh.parent).toBe(group)

        group.remove(mesh)
        expect(group.children).toHaveLength(0)
        expect(mesh.parent).toBeNull()
    })

    test('should transform all children', () => {
        const mesh1 = new Mesh(new RectGeometry(100, 100), new BasicMaterial({ color: '#ff0000' }))
        const mesh2 = new Mesh(new CircleGeometry(50), new BasicMaterial({ color: '#00ff00' }))

        group.add(mesh1)
        group.add(mesh2)

        group.position.set(100, 100)
        group.rotation = Math.PI / 4

        expect(group.position.x).toBe(100)
        expect(group.position.y).toBe(100)
        expect(group.rotation).toBe(Math.PI / 4)
    })

    test('should clone group with children', () => {
        const mesh = new Mesh(new RectGeometry(100, 100), new BasicMaterial({ color: '#ff0000' }))
        group.add(mesh)
        group.position.set(100, 200)

        const cloned = group.clone()

        expect(cloned).not.toBe(group)
        expect(cloned.children).toHaveLength(1)
        expect(cloned.position.x).toBe(100)
        expect(cloned.position.y).toBe(200)
    })
})

describe('Geometries', () => {
    test('RectGeometry should create rectangle', () => {
        const rect = new RectGeometry(100, 50, 10, 20)

        expect(rect.width).toBe(100)
        expect(rect.height).toBe(50)
        expect(rect.x).toBe(10)
        expect(rect.y).toBe(20)
    })

    test('CircleGeometry should create circle', () => {
        const circle = new CircleGeometry(50, 10, 20)

        expect(circle.radius).toBe(50)
        expect(circle.x).toBe(10)
        expect(circle.y).toBe(20)
    })
})

describe('Materials', () => {
    test('BasicMaterial should have color and opacity', () => {
        const material = new BasicMaterial({
            color: '#ff0000',
            opacity: 0.5,
        })

        expect(material.color).toBe('#ff0000')
        expect(material.opacity).toBe(0.5)
    })

    test('StrokeMaterial should have stroke properties', () => {
        const material = new StrokeMaterial({
            color: '#ff0000',
            lineWidth: 3,
            lineCap: 'round',
        })

        expect(material.color).toBe('#ff0000')
        expect(material.lineWidth).toBe(3)
        expect(material.lineCap).toBe('round')
    })
})
