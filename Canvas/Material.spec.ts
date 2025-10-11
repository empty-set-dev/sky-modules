// @vitest-environment jsdom

import './test-setup'

import { test, expect, vi, beforeEach, describe } from 'vitest'

import { BasicMaterial, StrokeMaterial, GradientMaterial } from './Material'

describe('BasicMaterial', () => {
    test('should create with default values', () => {
        const material = new BasicMaterial()

        expect(material.color).toBe('#ffffff')
        expect(material.opacity).toBe(1)
    })

    test('should create with custom values', () => {
        const material = new BasicMaterial({
            color: '#ff0000',
            opacity: 0.5,
        })

        expect(material.color).toBe('#ff0000')
        expect(material.opacity).toBe(0.5)
    })

    test('should apply material to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const material = new BasicMaterial({
            color: '#ff0000',
            opacity: 0.8,
        })

        material.apply(ctx, 1)

        expect(ctx.fillStyle).toBe('#ff0000')
        expect(ctx.globalAlpha).toBe(0.8)
    })

    test('should render filled path', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const material = new BasicMaterial()

        const fillSpy = vi.spyOn(ctx, 'fill')

        material.render(ctx)

        expect(fillSpy).toHaveBeenCalled()
    })

    test('should clone material', () => {
        const material = new BasicMaterial({
            color: '#ff0000',
            opacity: 0.5,
        })

        const cloned = material.clone()

        expect(cloned).not.toBe(material)
        expect(cloned.color).toBe('#ff0000')
        expect(cloned.opacity).toBe(0.5)
    })

    test('should handle all material parameters', () => {
        const material = new BasicMaterial({
            color: '#00ff00',
            opacity: 0.8,
            lineWidth: 5,
            lineCap: 'round',
            lineJoin: 'round',
            lineDash: [10, 5],
            lineDashOffset: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowOffsetX: 2,
            shadowOffsetY: 4,
            globalCompositeOperation: 'multiply'
        })

        expect(material.color).toBe('#00ff00')
        expect(material.opacity).toBe(0.8)
        expect(material.lineWidth).toBe(5)
        expect(material.lineCap).toBe('round')
        expect(material.lineJoin).toBe('round')
        expect(material.lineDash).toEqual([10, 5])
        expect(material.lineDashOffset).toBe(3)
        expect(material.shadowBlur).toBe(10)
        expect(material.shadowColor).toBe('rgba(0,0,0,0.5)')
        expect(material.shadowOffsetX).toBe(2)
        expect(material.shadowOffsetY).toBe(4)
        expect(material.globalCompositeOperation).toBe('multiply')
    })

    test('should handle empty parameters object', () => {
        const material = new BasicMaterial({})

        expect(material.color).toBe('#ffffff')
        expect(material.opacity).toBe(1)
        expect(material.lineWidth).toBe(1)
    })
})

describe('StrokeMaterial', () => {
    test('should create with default values', () => {
        const material = new StrokeMaterial()

        expect(material.color).toBe('#000000')
        expect(material.lineWidth).toBe(1)
        expect(material.lineCap).toBe('butt')
        expect(material.lineJoin).toBe('miter')
        expect(material.lineDash).toEqual([])
        expect(material.lineDashOffset).toBe(0)
        expect(material.opacity).toBe(1)
    })

    test('should create with custom values', () => {
        const material = new StrokeMaterial({
            color: '#00ff00',
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            lineDash: [5, 5],
            lineDashOffset: 2,
            opacity: 0.7,
        })

        expect(material.color).toBe('#00ff00')
        expect(material.lineWidth).toBe(3)
        expect(material.lineCap).toBe('round')
        expect(material.lineJoin).toBe('round')
        expect(material.lineDash).toEqual([5, 5])
        expect(material.lineDashOffset).toBe(2)
        expect(material.opacity).toBe(0.7)
    })

    test('should apply material to canvas context', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const material = new StrokeMaterial({
            color: '#00ff00',
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            lineDash: [5, 5],
            lineDashOffset: 2,
            opacity: 0.7,
        })

        const setLineDashSpy = vi.spyOn(ctx, 'setLineDash')

        material.apply(ctx, 1)

        expect(ctx.strokeStyle).toBe('#00ff00')
        expect(ctx.lineWidth).toBe(3)
        expect(ctx.lineCap).toBe('round')
        expect(ctx.lineJoin).toBe('round')
        expect(setLineDashSpy).toHaveBeenCalledWith([5, 5])
        expect(ctx.lineDashOffset).toBe(2)
        expect(ctx.globalAlpha).toBe(0.7)
    })

    test('should render stroked path', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const material = new StrokeMaterial()

        const strokeSpy = vi.spyOn(ctx, 'stroke')

        material.render(ctx)

        expect(strokeSpy).toHaveBeenCalled()
    })

    test('should clone material', () => {
        const material = new StrokeMaterial({
            color: '#00ff00',
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            lineDash: [5, 5],
            lineDashOffset: 2,
            opacity: 0.7,
        })

        const cloned = material.clone()

        expect(cloned).not.toBe(material)
        expect(cloned.color).toBe('#00ff00')
        expect(cloned.lineWidth).toBe(3)
        expect(cloned.lineCap).toBe('round')
        expect(cloned.lineJoin).toBe('round')
        expect(cloned.lineDash).toEqual([5, 5])
        expect(cloned.lineDashOffset).toBe(2)
        expect(cloned.opacity).toBe(0.7)
    })

    test('should handle parameters object without override', () => {
        const material = new StrokeMaterial()

        expect(material.color).toBe('#000000')  // Default for StrokeMaterial
        expect(material.lineWidth).toBe(1)
        expect(material.lineCap).toBe('butt')
        expect(material.lineJoin).toBe('miter')
        expect(material.lineDash).toEqual([])
        expect(material.lineDashOffset).toBe(0)
        expect(material.opacity).toBe(1)
    })

    test('should apply with pixelRatio scaling', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const material = new StrokeMaterial({
            lineWidth: 4,
            lineDash: [8, 4],
            lineDashOffset: 2,
            shadowBlur: 6
        })

        material.apply(ctx, 2)  // pixelRatio = 2

        expect(ctx.lineWidth).toBe(8)  // 4 * 2
        expect(ctx.lineDashOffset).toBe(4)  // 2 * 2
        expect(ctx.shadowBlur).toBe(12)  // 6 * 2
    })
})

describe('GradientMaterial', () => {
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let gradient: CanvasGradient

    beforeEach(() => {
        canvas = document.createElement('canvas')
        ctx = canvas.getContext('2d')!
        gradient = ctx.createLinearGradient(0, 0, 100, 100)
        gradient.addColorStop(0, '#ff0000')
        gradient.addColorStop(1, '#0000ff')
    })

    test('should create with gradient', () => {
        const material = new GradientMaterial({ gradient })

        expect(material.gradient).toBe(gradient)
        expect(material.opacity).toBe(1)
    })

    test('should create with custom opacity', () => {
        const material = new GradientMaterial({
            gradient,
            opacity: 0.6,
        })

        expect(material.gradient).toBe(gradient)
        expect(material.opacity).toBe(0.6)
    })

    test('should apply material to canvas context', () => {
        const material = new GradientMaterial({
            gradient,
            opacity: 0.8,
        })

        material.apply(ctx, 1)

        expect(ctx.fillStyle).toBe(gradient)
        expect(ctx.globalAlpha).toBe(0.8)
    })

    test('should render filled path', () => {
        const material = new GradientMaterial({ gradient })

        const fillSpy = vi.spyOn(ctx, 'fill')

        material.render(ctx)

        expect(fillSpy).toHaveBeenCalled()
    })

    test('should clone material', () => {
        const material = new GradientMaterial({
            gradient,
            opacity: 0.6,
        })

        const cloned = material.clone()

        expect(cloned).not.toBe(material)
        expect(cloned.gradient).toBe(gradient)
        expect(cloned.opacity).toBe(0.6)
    })
})
