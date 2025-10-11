// @vitest-environment jsdom

import '../../test-setup'

import { describe, expect, test, vi } from 'vitest'

import { RectGeometry } from '../RectGeometry'

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

    test('should create rectangle with zero values', () => {
        const rect = new RectGeometry(0, 0, 0, 0)

        expect(rect.width).toBe(0)
        expect(rect.height).toBe(0)
        expect(rect.x).toBe(0)
        expect(rect.y).toBe(0)
    })

    test('should create rectangle with negative values', () => {
        const rect = new RectGeometry(-10, -20, -5, -15)

        expect(rect.width).toBe(-10)
        expect(rect.height).toBe(-20)
        expect(rect.x).toBe(-5)
        expect(rect.y).toBe(-15)
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