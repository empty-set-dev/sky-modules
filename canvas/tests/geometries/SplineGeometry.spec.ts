// @vitest-environment jsdom

import '../../test-setup'

import { describe, expect, test, vi } from 'vitest'

import { SplineGeometry } from '../../geometries/SplineGeometry'

describe('SplineGeometry', () => {
    test('should create empty spline with default values', () => {
        const spline = new SplineGeometry()

        expect(spline.points).toEqual([])
        expect(spline.type).toBe('smooth')
        expect(spline.tension).toBe(0.5)
    })

    test('should create spline with initial points and custom settings', () => {
        const points = [
            { x: 0, y: 0 },
            { x: 10, y: 5 },
            { x: 20, y: 0 }
        ]
        const spline = new SplineGeometry({ points, type: 'cubic', tension: 0.3 })

        expect(spline.points).toEqual(points)
        expect(spline.type).toBe('cubic')
        expect(spline.tension).toBe(0.3)
    })

    test('should add single point', () => {
        const spline = new SplineGeometry()
        spline.addPoint(10, 20, 5, 15, 15, 25)

        expect(spline.points).toEqual([{ x: 10, y: 20, cp1x: 5, cp1y: 15, cp2x: 15, cp2y: 25 }])
    })

    test('should add multiple points', () => {
        const spline = new SplineGeometry()
        spline.addPoints(
            { x: 0, y: 0 },
            { x: 10, y: 5, cp1x: 5, cp1y: 2 },
            { x: 20, y: 0 }
        )

        expect(spline.points).toEqual([
            { x: 0, y: 0 },
            { x: 10, y: 5, cp1x: 5, cp1y: 2 },
            { x: 20, y: 0 }
        ])
    })

    test('should set points', () => {
        const spline = new SplineGeometry({ points: [{ x: 1, y: 1 }] })
        const newPoints = [
            { x: 0, y: 0 },
            { x: 10, y: 5 },
            { x: 20, y: 0 }
        ]
        spline.setPoints(newPoints)

        expect(spline.points).toEqual(newPoints)
    })

    test('should set spline type', () => {
        const spline = new SplineGeometry()
        spline.setType('quadratic')

        expect(spline.type).toBe('quadratic')
    })

    test('should set tension with clamping', () => {
        const spline = new SplineGeometry()

        spline.setTension(0.8)
        expect(spline.tension).toBe(0.8)

        spline.setTension(-0.5)
        expect(spline.tension).toBe(0)

        spline.setTension(1.5)
        expect(spline.tension).toBe(1)
    })

    test('should not draw with less than 2 points', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const spline = new SplineGeometry({ points: [{ x: 0, y: 0 }] })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        spline.draw(ctx, 1)

        expect(moveTo).not.toHaveBeenCalled()
        expect(closePath).not.toHaveBeenCalled()
    })

    test('should draw quadratic spline', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const spline = new SplineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 20, y: 0 }
            ],
            type: 'quadratic'
        })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const quadraticCurveTo = vi.spyOn(ctx, 'quadraticCurveTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        spline.draw(ctx, 1)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(quadraticCurveTo).toHaveBeenCalledTimes(3) // 2 points + closing curve
        expect(closePath).toHaveBeenCalled()
    })

    test('should draw cubic spline', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const spline = new SplineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 20, y: 0 }
            ],
            type: 'cubic'
        })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const bezierCurveTo = vi.spyOn(ctx, 'bezierCurveTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        spline.draw(ctx, 1)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(bezierCurveTo).toHaveBeenCalledTimes(3) // 2 points + closing curve
        expect(closePath).toHaveBeenCalled()
    })

    test('should draw smooth spline', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const spline = new SplineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 20, y: 0 },
                { x: 30, y: 5 }
            ],
            type: 'smooth'
        })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const bezierCurveTo = vi.spyOn(ctx, 'bezierCurveTo')
        const closePath = vi.spyOn(ctx, 'closePath')

        spline.draw(ctx, 1)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        expect(bezierCurveTo).toHaveBeenCalledTimes(4) // 3 points + closing curve
        expect(closePath).toHaveBeenCalled()
    })

    test('should apply pixelRatio correctly', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const spline = new SplineGeometry({
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 10 }
            ],
            type: 'quadratic'
        })

        const moveTo = vi.spyOn(ctx, 'moveTo')
        const quadraticCurveTo = vi.spyOn(ctx, 'quadraticCurveTo')

        spline.draw(ctx, 2)

        expect(moveTo).toHaveBeenCalledWith(0, 0)
        // Check that coordinates are scaled
        expect(quadraticCurveTo).toHaveBeenCalledWith(10, 10, 20, 20)
    })

    test('should clone spline', () => {
        const points = [
            { x: 0, y: 0, cp1x: 1, cp1y: 1 },
            { x: 10, y: 10 }
        ]
        const spline = new SplineGeometry({ points, type: 'cubic', tension: 0.8 })
        const cloned = spline.clone()

        expect(cloned).not.toBe(spline)
        expect(cloned.points).toEqual(points)
        expect(cloned.points).not.toBe(spline.points) // Should be a different array
        expect(cloned.type).toBe('cubic')
        expect(cloned.tension).toBe(0.8)
    })

    test('should create elliptical spline', () => {
        const spline = SplineGeometry.createEllipticalSpline(0, 0, 10, 5, 6)

        expect(spline.points).toHaveLength(6)
        expect(spline.type).toBe('smooth')
        expect(spline.tension).toBe(0.4)

        // First point should be at (10, 0)
        expect(spline.points[0]).toEqual({ x: 10, y: 0 })
    })

    test('should throw new Error for invalid elliptical spline', () => {
        expect(() => {
            SplineGeometry.createEllipticalSpline(0, 0, 10, 5, 2)
        }).toThrow('Elliptical spline must have at least 3 points')
    })

    test('should create wave spline', () => {
        const spline = SplineGeometry.createWaveSpline(0, 0, 20, 0, 5, 2)

        expect(spline.points.length).toBeGreaterThan(5)
        expect(spline.type).toBe('smooth')
        expect(spline.tension).toBe(0.3)

        // First point should be at start
        expect(spline.points[0]).toEqual({ x: 0, y: 0 })

        // Last point should be at end
        const lastPoint = spline.points[spline.points.length - 1]
        expect(lastPoint.x).toBe(20)
        expect(lastPoint.y).toBeCloseTo(0, 10)
    })

    test('should create heart spline', () => {
        const spline = SplineGeometry.createHeartSpline(0, 0, 1)

        expect(spline.points).toHaveLength(16)
        expect(spline.type).toBe('smooth')
        expect(spline.tension).toBe(0.4)

        // Should have valid coordinates
        spline.points.forEach(point => {
            expect(typeof point.x).toBe('number')
            expect(typeof point.y).toBe('number')
            expect(isFinite(point.x)).toBe(true)
            expect(isFinite(point.y)).toBe(true)
        })
    })
})