// @vitest-environment jsdom

import './test-setup'

import { describe, expect, test, vi } from 'vitest'

import { PolylineGeometry } from '../../geometries/PolylineGeometry'

describe('PolylineGeometry', () => {
    test('should create empty polyline with default values', () => {
        const polyline = new PolylineGeometry()

        expect(polyline.points).toEqual([])
        expect(polyline.closed).toBe(true)
    })

    test('should create polyline with initial points and closed setting', () => {
        const points = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ]
        const polyline = new PolylineGeometry({ points, closed: false })

        expect(polyline.points).toEqual(points)
        expect(polyline.closed).toBe(false)
    })

    test('should add single point', () => {
        const polyline = new PolylineGeometry()
        polyline.addPoint(10, 20)

        expect(polyline.points).toEqual([{ x: 10, y: 20 }])
    })

    test('should add multiple points', () => {
        const polyline = new PolylineGeometry()
        polyline.addPoints({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 })

        expect(polyline.points).toEqual([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ])
    })

    test('should set points', () => {
        const polyline = new PolylineGeometry({ points: [{ x: 1, y: 1 }] })
        const newPoints = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ]
        polyline.setPoints(newPoints)

        expect(polyline.points).toEqual(newPoints)
    })

    test('should set closed state', () => {
        const polyline = new PolylineGeometry({ points: [], closed: true })
        polyline.setClosed(false)

        expect(polyline.closed).toBe(false)
    })

    test('should not draw with less than 2 points', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const polyline = new PolylineGeometry({ points: [{ x: 0, y: 0 }] })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const lineTo = vi.spyOn(ctx, 'lineTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        polyline.draw(ctx, 1)

        expect(moveTo).not.toHaveBeenCalled()
        expect(lineTo).not.toHaveBeenCalled()
        expect(closePath).not.toHaveBeenCalled()
    })

    test('should draw open polyline', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const polyline = new PolylineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 5, y: 10 }
            ],
            closed: false
        }) // Open polyline

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const lineTo = vi.spyOn(ctx, 'lineTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        polyline.draw(ctx, 1)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(lineTo).toHaveBeenCalledWith(10, 0)
        expect(lineTo).toHaveBeenCalledWith(5, 10)
        expect(closePath).not.toHaveBeenCalled() // Should not close
    })

    test('should draw closed polyline (polygon)', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const polyline = new PolylineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 5, y: 10 }
            ],
            closed: true
        }) // Closed polyline

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const lineTo = vi.spyOn(ctx, 'lineTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        polyline.draw(ctx, 1)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(lineTo).toHaveBeenCalledWith(10, 0)
        expect(lineTo).toHaveBeenCalledWith(5, 10)
        expect(closePath).toHaveBeenCalled() // Should close
    })

    test('should apply pixelRatio correctly', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const polyline = new PolylineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 5, y: 10 }
            ]
        })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const lineTo = vi.spyOn(ctx, 'lineTo')

        polyline.draw(ctx, 2)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(lineTo).toHaveBeenCalledWith(20, 0)
        expect(lineTo).toHaveBeenCalledWith(10, 20)
    })

    test('should clone polyline', () => {
        const points = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ]
        const polyline = new PolylineGeometry({ points, closed: false })
        const cloned = polyline.clone()

        expect(cloned).not.toBe(polyline)
        expect(cloned.points).toEqual(points)
        expect(cloned.points).not.toBe(polyline.points) // Should be a different array
        expect(cloned.closed).toBe(false)
    })

    test('should create regular polygon', () => {
        const polyline = PolylineGeometry.createRegularPolygon(0, 0, 10, 6)

        expect(polyline.points).toHaveLength(6)
        expect(polyline.closed).toBe(true)

        // First point should be at (10, 0) with no rotation
        expect(polyline.points[0]).toEqual({ x: 10, y: 0 })
    })

    test('should create regular polygon with rotation', () => {
        const polyline = PolylineGeometry.createRegularPolygon(0, 0, 10, 4, Math.PI / 4)

        expect(polyline.points).toHaveLength(4)
        expect(polyline.closed).toBe(true)

        // With 45 degree rotation, first point should be at roughly (7.07, 7.07)
        expect(polyline.points[0].x).toBeCloseTo(7.071, 2)
        expect(polyline.points[0].y).toBeCloseTo(7.071, 2)
    })

    test('should throw new Error for invalid regular polygon', () => {
        expect(() => {
            PolylineGeometry.createRegularPolygon(0, 0, 10, 2)
        }).toThrow('Polygon must have at least 3 sides')
    })

    test('should create triangle', () => {
        const polyline = PolylineGeometry.createTriangle(0, 0, 10, 0, 5, 10)

        expect(polyline.points).toEqual([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ])
        expect(polyline.closed).toBe(true)
    })

    test('should create star', () => {
        const polyline = PolylineGeometry.createStar(0, 0, 10, 5, 5)

        expect(polyline.points).toHaveLength(10) // 5 outer + 5 inner points
        expect(polyline.closed).toBe(true)

        // First point should be outer point at (10, 0)
        expect(polyline.points[0]).toEqual({ x: 10, y: 0 })
    })

    test('should throw new Error for invalid star', () => {
        expect(() => {
            PolylineGeometry.createStar(0, 0, 10, 5, 2)
        }).toThrow('Star must have at least 3 points')
    })

    test('should create open path', () => {
        const points = [{ x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 0 }]
        const polyline = PolylineGeometry.createPath(points)

        expect(polyline.points).toEqual(points)
        expect(polyline.closed).toBe(false)
    })

    test('should create simple line', () => {
        const polyline = PolylineGeometry.createLine(0, 0, 10, 10)

        expect(polyline.points).toEqual([
            { x: 0, y: 0 },
            { x: 10, y: 10 }
        ])
        expect(polyline.closed).toBe(false)
    })

    test('should create polyline (open)', () => {
        const points = [{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 0 }]
        const polyline = PolylineGeometry.createPolyline(points)

        expect(polyline.points).toEqual(points)
        expect(polyline.closed).toBe(false)
    })

    test('should create polygon (closed)', () => {
        const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
        const polyline = PolylineGeometry.createPolygon(points)

        expect(polyline.points).toEqual(points)
        expect(polyline.closed).toBe(true)
    })
})