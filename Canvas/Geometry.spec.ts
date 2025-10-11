// @vitest-environment jsdom

import './test-setup'

import { describe, expect, test, vi } from 'vitest'

import { RectGeometry, CircleGeometry, EllipseGeometry, PathGeometry } from './Geometry'

describe('RectGeometry', () => {
    test('should create rectangle with default values', () => {
        const rect = new RectGeometry()

        expect(rect.width).toBe(1)
        expect(rect.height).toBe(1)
        expect(rect.x).toBe(0)
        expect(rect.y).toBe(0)
    })

    test('should create rectangle with custom values', () => {
        const rect = new RectGeometry(100, 50, 10, 20)

        expect(rect.width).toBe(100)
        expect(rect.height).toBe(50)
        expect(rect.x).toBe(10)
        expect(rect.y).toBe(20)
    })

    test('should draw rectangle to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const rect = new RectGeometry(100, 50, 10, 20)

        const rectSpy = vi.spyOn(ctx, 'rect')

        rect.draw(ctx, 1)

        expect(rectSpy).toHaveBeenCalledWith(10, 20, 100, 50)
    })

    test('should clone rectangle', () => {
        const rect = new RectGeometry(100, 50, 10, 20)
        const cloned = rect.clone()

        expect(cloned).not.toBe(rect)
        expect(cloned.width).toBe(100)
        expect(cloned.height).toBe(50)
        expect(cloned.x).toBe(10)
        expect(cloned.y).toBe(20)
    })
})

describe('CircleGeometry', () => {
    test('should create circle with default values', () => {
        const circle = new CircleGeometry()

        expect(circle.radius).toBe(1)
        expect(circle.x).toBe(0)
        expect(circle.y).toBe(0)
        expect(circle.startAngle).toBe(0)
        expect(circle.endAngle).toBe(Math.PI * 2)
        expect(circle.counterclockwise).toBe(false)
    })

    test('should create circle with custom values', () => {
        const circle = new CircleGeometry(50, 10, 20, Math.PI / 4, Math.PI, true)

        expect(circle.radius).toBe(50)
        expect(circle.x).toBe(10)
        expect(circle.y).toBe(20)
        expect(circle.startAngle).toBe(Math.PI / 4)
        expect(circle.endAngle).toBe(Math.PI)
        expect(circle.counterclockwise).toBe(true)
    })

    test('should draw circle to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const circle = new CircleGeometry(50, 10, 20)

        const arcSpy = vi.spyOn(ctx, 'arc')

        circle.draw(ctx, 1)

        expect(arcSpy).toHaveBeenCalledWith(10, 20, 50, 0, Math.PI * 2, false)
    })

    test('should clone circle', () => {
        const circle = new CircleGeometry(50, 10, 20, Math.PI / 4, Math.PI, true)
        const cloned = circle.clone()

        expect(cloned).not.toBe(circle)
        expect(cloned.radius).toBe(50)
        expect(cloned.x).toBe(10)
        expect(cloned.y).toBe(20)
        expect(cloned.startAngle).toBe(Math.PI / 4)
        expect(cloned.endAngle).toBe(Math.PI)
        expect(cloned.counterclockwise).toBe(true)
    })
})

describe('EllipseGeometry', () => {
    test('should create ellipse with default values', () => {
        const ellipse = new EllipseGeometry()

        expect(ellipse.radiusX).toBe(1)
        expect(ellipse.radiusY).toBe(0.5)
        expect(ellipse.x).toBe(0)
        expect(ellipse.y).toBe(0)
        expect(ellipse.rotation).toBe(0)
        expect(ellipse.startAngle).toBe(0)
        expect(ellipse.endAngle).toBe(Math.PI * 2)
        expect(ellipse.counterclockwise).toBe(false)
    })

    test('should create ellipse with custom values', () => {
        const ellipse = new EllipseGeometry(50, 30, 10, 20, Math.PI / 4, Math.PI / 8, Math.PI, true)

        expect(ellipse.radiusX).toBe(50)
        expect(ellipse.radiusY).toBe(30)
        expect(ellipse.x).toBe(10)
        expect(ellipse.y).toBe(20)
        expect(ellipse.rotation).toBe(Math.PI / 4)
        expect(ellipse.startAngle).toBe(Math.PI / 8)
        expect(ellipse.endAngle).toBe(Math.PI)
        expect(ellipse.counterclockwise).toBe(true)
    })

    test('should draw ellipse to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const ellipse = new EllipseGeometry(50, 30, 10, 20, Math.PI / 4)

        const ellipseSpy = vi.spyOn(ctx, 'ellipse')

        ellipse.draw(ctx, 1)

        expect(ellipseSpy).toHaveBeenCalledWith(10, 20, 50, 30, Math.PI / 4, 0, Math.PI * 2, false)
    })

    test('should clone ellipse', () => {
        const ellipse = new EllipseGeometry(50, 30, 10, 20, Math.PI / 4, Math.PI / 8, Math.PI, true)
        const cloned = ellipse.clone()

        expect(cloned).not.toBe(ellipse)
        expect(cloned.radiusX).toBe(50)
        expect(cloned.radiusY).toBe(30)
        expect(cloned.x).toBe(10)
        expect(cloned.y).toBe(20)
        expect(cloned.rotation).toBe(Math.PI / 4)
        expect(cloned.startAngle).toBe(Math.PI / 8)
        expect(cloned.endAngle).toBe(Math.PI)
        expect(cloned.counterclockwise).toBe(true)
    })
})

describe('PathGeometry', () => {
    test('should create empty path', () => {
        const path = new PathGeometry()

        expect(path.commands).toHaveLength(0)
    })

    test('should add moveTo command', () => {
        const path = new PathGeometry()
        path.moveTo(10, 20)

        expect(path.commands).toHaveLength(1)
        expect(path.commands[0]).toEqual({ type: 'moveTo', args: [10, 20] })
    })

    test('should add lineTo command', () => {
        const path = new PathGeometry()
        path.lineTo(30, 40)

        expect(path.commands).toHaveLength(1)
        expect(path.commands[0]).toEqual({ type: 'lineTo', args: [30, 40] })
    })

    test('should add quadraticCurveTo command', () => {
        const path = new PathGeometry()
        path.quadraticCurveTo(10, 20, 30, 40)

        expect(path.commands).toHaveLength(1)
        expect(path.commands[0]).toEqual({
            type: 'quadraticCurveTo',
            args: [10, 20, 30, 40],
        })
    })

    test('should add bezierCurveTo command', () => {
        const path = new PathGeometry()
        path.bezierCurveTo(10, 20, 30, 40, 50, 60)

        expect(path.commands).toHaveLength(1)
        expect(path.commands[0]).toEqual({
            type: 'bezierCurveTo',
            args: [10, 20, 30, 40, 50, 60],
        })
    })

    test('should close path', () => {
        const path = new PathGeometry()
        path.closePath()

        expect(path.commands).toHaveLength(1)
        expect(path.commands[0]).toEqual({ type: 'closePath', args: [] })
    })

    test('should draw path to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const path = new PathGeometry()

        const moveToSpy = vi.spyOn(ctx, 'moveTo')
        const lineToSpy = vi.spyOn(ctx, 'lineTo')
        const closePathSpy = vi.spyOn(ctx, 'closePath')

        path.moveTo(10, 20)
        path.lineTo(30, 40)
        path.closePath()

        path.draw(ctx, 1)

        expect(moveToSpy).toHaveBeenCalledWith(10, 20)
        expect(lineToSpy).toHaveBeenCalledWith(30, 40)
        expect(closePathSpy).toHaveBeenCalled()
    })

    test('should clone path with all commands', () => {
        const path = new PathGeometry()
        path.moveTo(10, 20)
        path.lineTo(30, 40)
        path.closePath()

        const cloned = path.clone()

        expect(cloned).not.toBe(path)
        expect(cloned.commands).toHaveLength(3)
        expect(cloned.commands).toEqual(path.commands)
    })
})
