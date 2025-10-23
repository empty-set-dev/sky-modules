// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

import Canvas from './Canvas'
import { RectGeometry, CircleGeometry } from './geometries'
import Group from './Group'
import { BasicMaterial, StrokeMaterial } from './materials'
import Mesh from './Mesh'
import Scene from './Scene'

describe('Canvas', () => {
    let canvas: Canvas
    let scene: Scene

    beforeEach(() => {
        canvas = new Canvas({
            size: () => [800, 600],
            pixelRatio: 1, // Force pixelRatio to 1 for tests
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

    test('should scale coordinates with pixelRatio', () => {
        const highDPICanvas = new Canvas({
            size: () => [100, 100],
            pixelRatio: 2
        })

        highDPICanvas.moveTo(10, 20)
        highDPICanvas.lineTo(30, 40)
        highDPICanvas.rect(5, 5, 10, 10)

        // Verify that coordinates are scaled by pixelRatio
        expect(highDPICanvas.pixelRatio).toBe(2)
    })

    test('should handle drawing operations', () => {
        canvas.beginPath()
        canvas.moveTo(10, 10)
        canvas.lineTo(50, 50)
        canvas.arcTo(60, 60, 70, 70, 10)
        canvas.arc(100, 100, 20, 0, Math.PI * 2)
        canvas.ellipse(200, 200, 30, 20, 0, 0, Math.PI * 2)
        canvas.quadraticCurveTo(250, 250, 300, 300)
        canvas.bezierCurveTo(350, 350, 400, 400, 450, 450)
        canvas.closePath()

        expect(canvas.drawContext.beginPath).toHaveBeenCalled()
        expect(canvas.drawContext.moveTo).toHaveBeenCalledWith(10, 10) // pixelRatio = 1
        expect(canvas.drawContext.lineTo).toHaveBeenCalledWith(50, 50) // pixelRatio = 1
        expect(canvas.drawContext.closePath).toHaveBeenCalled()
    })

    test('should handle all drawing methods', () => {
        canvas.fillRect(10, 10, 50, 30)
        canvas.strokeRect(20, 20, 40, 25)
        canvas.clearRect(5, 5, 10, 10)

        expect(canvas.drawContext.fillRect).toHaveBeenCalledWith(10, 10, 50, 30)
        expect(canvas.drawContext.strokeRect).toHaveBeenCalledWith(20, 20, 40, 25)
        expect(canvas.drawContext.clearRect).toHaveBeenCalledWith(5, 5, 10, 10)
    })

    test('should handle text rendering', () => {
        canvas.fillText('Hello', 100, 100)
        canvas.strokeText('World', 150, 150, 200)

        expect(canvas.drawContext.fillText).toHaveBeenCalledWith('Hello', 100, 100, undefined)
        expect(canvas.drawContext.strokeText).toHaveBeenCalledWith('World', 150, 150, 200)
    })

    test('should handle transformations', () => {
        canvas.save()
        canvas.scale(2, 3)
        canvas.rotate(Math.PI / 4)
        canvas.translate(10, 20)
        canvas.transform(1, 0, 0, 1, 5, 10)
        canvas.setTransform(1, 0, 0, 1, 15, 25)
        canvas.resetTransform()
        canvas.restore()

        expect(canvas.drawContext.save).toHaveBeenCalled()
        expect(canvas.drawContext.scale).toHaveBeenCalledWith(2, 3)
        expect(canvas.drawContext.rotate).toHaveBeenCalledWith(Math.PI / 4)
        expect(canvas.drawContext.translate).toHaveBeenCalledWith(10, 20)
        expect(canvas.drawContext.resetTransform).toHaveBeenCalled()
        expect(canvas.drawContext.restore).toHaveBeenCalled()
    })

    test('should handle style setters', () => {
        canvas.setFillStyle('#ff0000')
        canvas.setStrokeStyle('#00ff00')
        canvas.setLineWidth(3)
        canvas.setLineCap('round')
        canvas.setLineJoin('round')
        canvas.setLineDash([5, 5])
        canvas.setLineDashOffset(2)
        canvas.setGlobalAlpha(0.5)
        canvas.setGlobalCompositeOperation('multiply')

        expect(canvas.drawContext.fillStyle).toBe('#ff0000')
        expect(canvas.drawContext.strokeStyle).toBe('#00ff00')
        expect(canvas.drawContext.lineWidth).toBe(3)
        expect(canvas.drawContext.lineCap).toBe('round')
        expect(canvas.drawContext.lineJoin).toBe('round')
        expect(canvas.drawContext.globalAlpha).toBe(0.5)
        expect(canvas.drawContext.globalCompositeOperation).toBe('multiply')
    })

    test('should handle shadow properties', () => {
        canvas.setShadowBlur(10)
        canvas.setShadowColor('rgba(0,0,0,0.5)')
        canvas.setShadowOffsetX(5)
        canvas.setShadowOffsetY(8)

        expect(canvas.drawContext.shadowBlur).toBe(10)
        expect(canvas.drawContext.shadowColor).toBe('rgba(0,0,0,0.5)')
        expect(canvas.drawContext.shadowOffsetX).toBe(5)
        expect(canvas.drawContext.shadowOffsetY).toBe(8)
    })

    test('should handle font properties', () => {
        canvas.setFont('16px Arial')
        canvas.setTextAlign('center')
        canvas.setTextBaseline('middle')
        canvas.setMiterLimit(10)

        expect(canvas.drawContext.font).toBe('16px Arial')
        expect(canvas.drawContext.textAlign).toBe('center')
        expect(canvas.drawContext.textBaseline).toBe('middle')
        expect(canvas.drawContext.miterLimit).toBe(10)
    })

    test('should handle path operations', () => {
        canvas.beginPath()
        canvas.fill()
        canvas.stroke()
        canvas.clip()

        expect(canvas.drawContext.beginPath).toHaveBeenCalled()
        expect(canvas.drawContext.fill).toHaveBeenCalled()
        expect(canvas.drawContext.stroke).toHaveBeenCalled()
        expect(canvas.drawContext.clip).toHaveBeenCalled()
    })

    test('should create canvas with existing element', () => {
        const element = document.createElement('canvas')
        const canvasWithElement = new Canvas({
            canvas: element,
            size: () => [400, 300],
            pixelRatio: 1,
        })

        expect(canvasWithElement.domElement).toBe(element)
        expect(canvasWithElement.domElement.width).toBe(400)
        expect(canvasWithElement.domElement.height).toBe(300)
    })

    test('should use default pixelRatio when not specified', () => {
        expect(canvas.pixelRatio).toBe(1)
    })

    test('should use custom pixelRatio', () => {
        const customCanvas = new Canvas({
            size: () => [100, 100],
            pixelRatio: 3
        })

        expect(customCanvas.pixelRatio).toBe(3)
    })

    test('should handle size function changes', () => {
        let width = 100
        let height = 100

        const dynamicCanvas = new Canvas({
            size: () => [width, height],
            pixelRatio: 1,
        })

        expect(dynamicCanvas.domElement.width).toBe(100)
        expect(dynamicCanvas.domElement.height).toBe(100)

        width = 200
        height = 150
        dynamicCanvas.onResize()

        expect(dynamicCanvas.domElement.width).toBe(200)
        expect(dynamicCanvas.domElement.height).toBe(150)
    })

    test('should scale canvas for high DPI', () => {
        const highDPICanvas = new Canvas({
            size: () => [100, 100],
            pixelRatio: 2
        })

        expect(highDPICanvas.domElement.width).toBe(200)
        expect(highDPICanvas.domElement.height).toBe(200)
        expect(highDPICanvas.domElement.style.transform).toBe('scale(50.00%)')
    })

    test('should handle scene rendering with background', () => {
        scene.setBackground('#123456')

        canvas.render(scene)

        // Should render background - just verify it doesn't throw
        expect(scene.background).toBe('#123456')
    })

    test('should clear canvas before rendering', () => {
        canvas.render(scene)
        expect(canvas.drawContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600)
    })

    test('should render mesh geometry and material', () => {
        const rect = new RectGeometry(100, 100, 50, 50)
        const strokeMaterial = new StrokeMaterial({
            color: '#00ff00',
            lineWidth: 3
        })
        const mesh = new Mesh(rect, strokeMaterial)
        scene.add(mesh)

        canvas.render(scene)

        expect(canvas.drawContext.strokeStyle).toBe('#00ff00')
        expect(canvas.drawContext.lineWidth).toBe(3)
    })

    test('should handle nested groups rendering', () => {
        const group1 = new Group()
        const group2 = new Group()
        const mesh = new Mesh(
            new RectGeometry(50, 50),
            new BasicMaterial({ color: '#ff0000' })
        )

        group2.add(mesh)
        group1.add(group2)
        scene.add(group1)

        group1.position.set(10, 20)
        group2.position.set(5, 5)

        canvas.render(scene)

        // Should render with combined transformations
        expect(scene.children).toHaveLength(1)
    })

    test('should handle invisible objects', () => {
        const mesh = new Mesh(
            new RectGeometry(100, 100),
            new BasicMaterial({ color: '#ff0000' })
        )
        mesh.visible = false
        scene.add(mesh)

        canvas.render(scene)

        // Invisible objects shouldn't be rendered
        expect(scene.children).toHaveLength(1)
    })

    test('should handle empty scene rendering', () => {
        canvas.render(scene)
        expect(canvas.drawContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600)
    })

    test('should handle multiple mesh rendering', () => {
        const mesh1 = new Mesh(
            new RectGeometry(50, 50),
            new BasicMaterial({ color: '#ff0000' })
        )
        const mesh2 = new Mesh(
            new CircleGeometry(25),
            new StrokeMaterial({ color: '#00ff00' })
        )

        scene.add(mesh1)
        scene.add(mesh2)

        canvas.render(scene)

        expect(scene.children).toHaveLength(2)
    })

    test('should apply transformations during rendering', () => {
        const mesh = new Mesh(
            new RectGeometry(100, 100),
            new BasicMaterial({ color: '#ff0000' })
        )

        mesh.position.set(50, 75)
        mesh.rotation = Math.PI / 4
        mesh.scale.set(2, 1.5)

        scene.add(mesh)
        canvas.render(scene)

        expect(canvas.drawContext.save).toHaveBeenCalled()
        expect(canvas.drawContext.translate).toHaveBeenCalledWith(50, 75)
        expect(canvas.drawContext.rotate).toHaveBeenCalledWith(Math.PI / 4)
        expect(canvas.drawContext.scale).toHaveBeenCalledWith(2, 1.5)
        expect(canvas.drawContext.restore).toHaveBeenCalled()
    })

    test('should dispose canvas properly', () => {
        const disposedCanvas = new Canvas({ size: () => [100, 100], pixelRatio: 1 })
        disposedCanvas.dispose?.()
        // Should not throw error
        expect(() => disposedCanvas.dispose?.()).not.toThrow()
    })
})

describe('Canvas drawHexagon', () => {
    let canvas: Canvas

    beforeEach(() => {
        canvas = new Canvas({
            size: () => [400, 300],
            pixelRatio: 1,
        })
    })

    test('should draw full hexagon with default parameters', () => {
        const savespy = vi.spyOn(canvas.drawContext, 'save')
        const beginPathSpy = vi.spyOn(canvas.drawContext, 'beginPath')
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')
        const closePathSpy = vi.spyOn(canvas.drawContext, 'closePath')
        const restoreSpy = vi.spyOn(canvas.drawContext, 'restore')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50
        })

        expect(savespy).toHaveBeenCalled()
        expect(beginPathSpy).toHaveBeenCalled()
        expect(lineToSpy).toHaveBeenCalledTimes(6) // 6 sides of hexagon
        expect(closePathSpy).toHaveBeenCalled()
        expect(restoreSpy).toHaveBeenCalled()
    })

    test('should draw hexagon with custom angle', () => {
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')

        canvas.drawHexagon({
            x: 0,
            y: 0,
            radius: 10,
            angle: 30
        })

        expect(lineToSpy).toHaveBeenCalledTimes(6)
        // Verify first point is rotated by 30 degrees
        const firstCall = lineToSpy.mock.calls[0]
        expect(firstCall).toBeDefined()
    })

    test('should draw hexagon with specific sides', () => {
        const moveToSpy = vi.spyOn(canvas.drawContext, 'moveTo')
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')

        canvas.drawHexagon({
            x: 50,
            y: 50,
            radius: 25,
            sides: [0, 1, 2] // Only draw first 3 sides
        })

        expect(moveToSpy).toHaveBeenCalledTimes(3) // 3 move operations
        expect(lineToSpy).toHaveBeenCalledTimes(3) // 3 line operations
    })

    test('should fill hexagon when color provided', () => {
        const fillSpy = vi.spyOn(canvas.drawContext, 'fill')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            color: '#ff0000'
        })

        expect(canvas.drawContext.fillStyle).toBe('#ff0000')
        expect(fillSpy).toHaveBeenCalled()
    })

    test('should stroke hexagon when strokeColor and strokeWidth provided', () => {
        const strokeSpy = vi.spyOn(canvas.drawContext, 'stroke')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            strokeColor: '#0000ff',
            strokeWidth: 3
        })

        expect(canvas.drawContext.strokeStyle).toBe('#0000ff')
        expect(canvas.drawContext.lineWidth).toBe(3)
        expect(strokeSpy).toHaveBeenCalled()
    })

    test('should fill and stroke when both provided', () => {
        const fillSpy = vi.spyOn(canvas.drawContext, 'fill')
        const strokeSpy = vi.spyOn(canvas.drawContext, 'stroke')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            color: '#ff0000',
            strokeColor: '#0000ff',
            strokeWidth: 2
        })

        expect(fillSpy).toHaveBeenCalled()
        expect(strokeSpy).toHaveBeenCalled()
    })

    test('should not fill when no color provided', () => {
        const fillSpy = vi.spyOn(canvas.drawContext, 'fill')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50
        })

        expect(fillSpy).not.toHaveBeenCalled()
    })

    test('should not stroke when no strokeColor provided', () => {
        const strokeSpy = vi.spyOn(canvas.drawContext, 'stroke')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            strokeWidth: 2 // strokeWidth without strokeColor
        })

        expect(strokeSpy).not.toHaveBeenCalled()
    })

    test('should not stroke when no strokeWidth provided', () => {
        const strokeSpy = vi.spyOn(canvas.drawContext, 'stroke')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            strokeColor: '#0000ff' // strokeColor without strokeWidth
        })

        expect(strokeSpy).not.toHaveBeenCalled()
    })

    test('should handle zero radius', () => {
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 0
        })

        expect(lineToSpy).toHaveBeenCalledTimes(6)
        // All points should be at center
        lineToSpy.mock.calls.forEach(call => {
            expect(call[0]).toBe(100)
            expect(call[1]).toBe(100)
        })
    })

    test('should handle negative coordinates', () => {
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')

        canvas.drawHexagon({
            x: -50,
            y: -50,
            radius: 10
        })

        expect(lineToSpy).toHaveBeenCalledTimes(6)
    })

    test('should handle empty sides array', () => {
        const moveToSpy = vi.spyOn(canvas.drawContext, 'moveTo')
        const lineToSpy = vi.spyOn(canvas.drawContext, 'lineTo')

        canvas.drawHexagon({
            x: 100,
            y: 100,
            radius: 50,
            sides: []
        })

        expect(moveToSpy).not.toHaveBeenCalled()
        expect(lineToSpy).not.toHaveBeenCalled()
    })
})




