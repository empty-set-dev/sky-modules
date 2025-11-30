import { describe, it, expect, beforeEach, vi } from 'vitest'

import EffectTree from './EffectTree'

// Mock window for tests
Object.defineProperty(global, 'window', {
    value: {
        innerWidth: 1920,
        innerHeight: 1080,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    },
    writable: true,
})

describe('EffectTree', () => {
    let effectTree: EffectTree

    beforeEach(() => {
        effectTree = new EffectTree()
    })

    it('should be identified as EffectTree', () => {
        expect(effectTree.isEffectTree).toBe(true)
    })

    it('should return itself as root', () => {
        expect(effectTree.root).toBe(effectTree)
    })

    it('should initialize mouse state', () => {
        expect(effectTree.isLeftMousePressed).toBe(false)
        expect(effectTree.isMiddleMousePressed).toBe(false)
        expect(effectTree.isRightMousePressed).toBe(false)
    })

    it('should get gamepad by index', () => {
        expect(effectTree.getGamepad(0)).toBeNull()
        const mockGamepad = { index: 0 } as Gamepad
        effectTree.gamepadStates[0] = mockGamepad
        expect(effectTree.getGamepad(0)).toBe(mockGamepad)
        expect(effectTree.getGamepad()).toBe(mockGamepad) // default index 0
        expect(effectTree.getGamepad(1)).toBeNull()
    })

    it('should track gamepad button state', () => {
        expect(effectTree.isGamepadButtonPressed(0, 0)).toBe(false)
        effectTree.gamepadButtonPressed['gamepad-0-button-0'] = true
        expect(effectTree.isGamepadButtonPressed(0, 0)).toBe(true)
    })

    it('should commit operations', () => {
        expect(() => effectTree.commit()).not.toThrow()
    })

    it('should emit events', () => {
        expect(() => {
            effectTree.emit('test', { data: 'test' })
        }).not.toThrow()
    })
})
