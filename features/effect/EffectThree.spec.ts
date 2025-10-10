import { describe, it, expect, beforeEach, vi } from 'vitest'

import EffectThree from './EffectThree'

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

describe('EffectThree', () => {
    let effectThree: EffectThree

    beforeEach(() => {
        effectThree = new EffectThree()
    })

    it('should be identified as EffectThree', () => {
        expect(effectThree.isEffectThree).toBe(true)
    })

    it('should return itself as root', () => {
        expect(effectThree.root).toBe(effectThree)
    })

    it('should initialize mouse state', () => {
        expect(effectThree.isLeftMousePressed).toBe(false)
        expect(effectThree.isMiddleMousePressed).toBe(false)
        expect(effectThree.isRightMousePressed).toBe(false)
    })

    it('should get gamepad by index', () => {
        expect(effectThree.getGamepad(0)).toBeNull()
        const mockGamepad = { index: 0 } as Gamepad
        effectThree.gamepadStates[0] = mockGamepad
        expect(effectThree.getGamepad(0)).toBe(mockGamepad)
        expect(effectThree.getGamepad()).toBe(mockGamepad) // default index 0
        expect(effectThree.getGamepad(1)).toBeNull()
    })

    it('should track gamepad button state', () => {
        expect(effectThree.isGamepadButtonPressed(0, 0)).toBe(false)
        effectThree.gamepadButtonPressed['gamepad-0-button-0'] = true
        expect(effectThree.isGamepadButtonPressed(0, 0)).toBe(true)
    })

    it('should commit operations', () => {
        expect(() => effectThree.commit()).not.toThrow()
    })

    it('should emit events', () => {
        expect(() => {
            effectThree.emit('test', { data: 'test' })
        }).not.toThrow()
    })
})