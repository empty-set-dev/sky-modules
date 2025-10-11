// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, vi, beforeEach } from 'vitest'

import Canvas from './Canvas'
import './_Canvas+drawHexagon'

describe('Canvas drawHexagon', () => {
    let canvas: Canvas

    beforeEach(() => {
        canvas = new Canvas({
            size: () => [400, 300]
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