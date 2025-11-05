// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach } from 'vitest'

import Scene from '../../core/Scene'

describe('Scene', () => {
    let scene: Scene

    beforeEach(() => {
        scene = new Scene()
    })

    test('should create with default values', () => {
        expect(scene.position.x).toBe(0)
        expect(scene.position.y).toBe(0)
        expect(scene.rotation).toBe(0)
        expect(scene.scale.x).toBe(1)
        expect(scene.scale.y).toBe(1)
        expect(scene.visible).toBe(true)
        expect(scene.background).toBeUndefined()
        expect(scene.parent).toBeNull()
        expect(scene.children).toEqual([])
    })

    test('should have context property', () => {
        expect(Scene.context).toBe(true)
    })

    test('should set background color', () => {
        scene.setBackground('#ff0000')
        expect(scene.background).toBe('#ff0000')
    })

    test('should set background to white', () => {
        scene.setBackground('#ffffff')
        expect(scene.background).toBe('#ffffff')
    })

    test('should set background to black', () => {
        scene.setBackground('#000000')
        expect(scene.background).toBe('#000000')
    })

    test('should set background to hex color', () => {
        scene.setBackground('#123456')
        expect(scene.background).toBe('#123456')
    })

    test('should set background to rgba color', () => {
        scene.setBackground('rgba(255, 0, 0, 0.5)')
        expect(scene.background).toBe('rgba(255, 0, 0, 0.5)')
    })

    test('should set background to rgb color', () => {
        scene.setBackground('rgb(100, 150, 200)')
        expect(scene.background).toBe('rgb(100, 150, 200)')
    })

    test('should set background to named color', () => {
        scene.setBackground('red')
        expect(scene.background).toBe('red')
    })

    test('should set background gradient', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const gradient = ctx.createLinearGradient(0, 0, 100, 100)
        gradient.addColorStop(0, '#ff0000')
        gradient.addColorStop(1, '#0000ff')

        scene.setBackground(gradient)
        expect(scene.background).toBe(gradient)
    })

    test('should set background pattern', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const patternCanvas = document.createElement('canvas')
        const pattern = ctx.createPattern(patternCanvas, 'repeat')!

        scene.setBackground(pattern)
        expect(scene.background).toBe(pattern)
    })

    test('should return this from setBackground', () => {
        const result = scene.setBackground('#ff0000')
        expect(result).toBe(scene)
    })

    test('should chain setBackground calls', () => {
        const result = scene
            .setBackground('#ff0000')
            .setBackground('#00ff00')

        expect(result).toBe(scene)
        expect(scene.background).toBe('#00ff00')
    })

    test('should clone scene with background', () => {
        scene.position.set(10, 20)
        scene.rotation = Math.PI / 4
        scene.scale.set(2, 3)
        scene.visible = false
        scene.setBackground('#ff0000')

        const cloned = scene.clone()

        expect(cloned.position.x).toBe(10)
        expect(cloned.position.y).toBe(20)
        expect(cloned.rotation).toBe(Math.PI / 4)
        expect(cloned.scale.x).toBe(2)
        expect(cloned.scale.y).toBe(3)
        expect(cloned.visible).toBe(false)
        expect(cloned.background).toBe('#ff0000')
        expect(cloned).not.toBe(scene)
    })

    test('should clone scene without background', () => {
        scene.position.set(5, 15)
        scene.rotation = Math.PI / 2
        scene.scale.set(1.5, 2.5)
        scene.visible = true

        const cloned = scene.clone()

        expect(cloned.position.x).toBe(5)
        expect(cloned.position.y).toBe(15)
        expect(cloned.rotation).toBe(Math.PI / 2)
        expect(cloned.scale.x).toBe(1.5)
        expect(cloned.scale.y).toBe(2.5)
        expect(cloned.visible).toBe(true)
        expect(cloned.background).toBeUndefined()
        expect(cloned).not.toBe(scene)
    })

    test('should clone with gradient background', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const gradient = ctx.createLinearGradient(0, 0, 100, 100)

        scene.setBackground(gradient)
        const cloned = scene.clone()

        expect(cloned.background).toBe(gradient)
    })

    test('should clone with pattern background', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const patternCanvas = document.createElement('canvas')
        const pattern = ctx.createPattern(patternCanvas, 'repeat')!

        scene.setBackground(pattern)
        const cloned = scene.clone()

        expect(cloned.background).toBe(pattern)
    })

    test('should inherit Object2D functionality', () => {
        const child = new Scene()
        scene.add(child)

        expect(scene.children).toHaveLength(1)
        expect(child.parent).toBe(scene)
    })

    test('should update background after cloning', () => {
        scene.setBackground('#ff0000')
        const cloned = scene.clone()

        scene.setBackground('#00ff00')

        expect(scene.background).toBe('#00ff00')
        expect(cloned.background).toBe('#ff0000')
    })

    test('should handle empty string background', () => {
        scene.setBackground('')
        expect(scene.background).toBe('')
    })

    test('should overwrite existing background', () => {
        scene.setBackground('#ff0000')
        expect(scene.background).toBe('#ff0000')

        scene.setBackground('#00ff00')
        expect(scene.background).toBe('#00ff00')
    })

    test('should handle transparent background', () => {
        scene.setBackground('transparent')
        expect(scene.background).toBe('transparent')
    })

    test('should handle hsl color background', () => {
        scene.setBackground('hsl(120, 100%, 50%)')
        expect(scene.background).toBe('hsl(120, 100%, 50%)')
    })

    test('should handle hsla color background', () => {
        scene.setBackground('hsla(240, 100%, 50%, 0.8)')
        expect(scene.background).toBe('hsla(240, 100%, 50%, 0.8)')
    })
})