import { describe, it, expect, beforeEach, vi } from 'vitest'

import EffectThree from './EffectThree'

// Mock window and global objects for tests
Object.defineProperty(global, 'window', {
    value: {
        innerWidth: 1920,
        innerHeight: 1080,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        requestAnimationFrame: vi.fn((cb) => setTimeout(cb, 16)),
        cancelAnimationFrame: vi.fn(),
    },
    writable: true,
})

Object.defineProperty(global, 'navigator', {
    value: {
        getGamepads: vi.fn(() => []),
    },
    writable: true,
})

Object.defineProperty(global, 'requestAnimationFrame', {
    value: vi.fn((cb) => setTimeout(cb, 16)),
    writable: true,
})

Object.defineProperty(global, 'cancelAnimationFrame', {
    value: vi.fn(),
    writable: true,
})

describe('EffectThree', () => {
    let effectThree: EffectThree

    beforeEach(() => {
        vi.clearAllMocks()
        effectThree = new EffectThree()
    })

    describe('initialization', () => {
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

        it('should initialize gamepad state', () => {
            expect(effectThree.gamepadStates).toEqual({})
            expect(effectThree.gamepadButtonPressed).toEqual({})
        })
    })

    describe('gamepad support', () => {
        it('should get gamepad by index', () => {
            const mockGamepad = { index: 0, buttons: [], axes: [] } as any
            effectThree.gamepadStates[0] = mockGamepad

            expect(effectThree.getGamepad(0)).toBe(mockGamepad)
            expect(effectThree.getGamepad(1)).toBeNull()
        })

        it('should track gamepad button state', () => {
            expect(effectThree.isGamepadButtonPressed(0, 0)).toBe(false)

            effectThree.gamepadButtonPressed['gamepad-0-button-0'] = true
            expect(effectThree.isGamepadButtonPressed(0, 0)).toBe(true)
        })

        it('should register gamepad events', () => {
            const before = vi.fn()
            const after = vi.fn()

            const result = effectThree.registerGamepadEvents({ before, after })

            expect(result).toBe(effectThree)
        })

        it('should handle gamepad connection events', () => {
            const mockGamepad = { index: 0 } as any

            // Test gamepad state management
            effectThree.gamepadStates[0] = mockGamepad
            expect(effectThree.gamepadStates[0]).toBe(mockGamepad)

            // Test that registration doesn't throw
            expect(() => {
                effectThree.registerGamepadEvents()
            }).not.toThrow()
        })
    })

    describe('mouse events', () => {
        it('should register mouse events', () => {
            const before = vi.fn()
            const after = vi.fn()

            const result = effectThree.registerMouseEvents({ before, after })

            expect(result).toBe(effectThree)
        })

        it('should track mouse button states', () => {
            // Simulate mouse down events
            effectThree.isLeftMousePressed = true
            effectThree.isMiddleMousePressed = true
            effectThree.isRightMousePressed = true

            expect(effectThree.isLeftMousePressed).toBe(true)
            expect(effectThree.isMiddleMousePressed).toBe(true)
            expect(effectThree.isRightMousePressed).toBe(true)
        })
    })

    describe('keyboard events', () => {
        it('should register keyboard events', () => {
            const before = vi.fn()
            const after = vi.fn()

            const result = effectThree.registerEmitKeyboardEvents(before, after)

            expect(result).toBe(effectThree)
        })

        it('should track key pressed state', () => {
            effectThree.isPressed['KeyA'] = true
            effectThree.isPressed['KeyB'] = true

            expect(effectThree.isPressed['KeyA']).toBe(true)
            expect(effectThree.isPressed['KeyB']).toBe(true)
            expect(effectThree.isPressed['KeyC']).toBeFalsy()
        })
    })

    describe('update events', () => {
        it('should register update events', () => {
            const before = vi.fn()
            const after = vi.fn()

            const result = effectThree.registerUpdateEvents({ before, after })

            expect(result).toBe(effectThree)
        })
    })

    describe('render events', () => {
        it('should register render events', () => {
            const before = vi.fn()
            const after = vi.fn()

            const result = effectThree.registerRenderEvents(before, after)

            expect(result).toBe(effectThree)
        })
    })

    describe('window resize events', () => {
        it('should register window resize events', () => {
            const resize = vi.fn()

            const result = effectThree.registerEmitWindowResize({ resize })

            expect(result).toBe(effectThree)
            expect(resize).toHaveBeenCalledWith(1920, 1080)
        })
    })

    describe('commit operations', () => {
        it('should process pending operations', () => {
            // Test the commit method
            expect(() => effectThree.commit()).not.toThrow()
        })
    })

    describe('event emission', () => {
        it('should emit events', () => {
            // Test that emit doesn't throw
            expect(() => {
                effectThree.emit('test', { data: 'test' })
            }).not.toThrow()
        })

        it('should emit reversed events', () => {
            // Test that emitReversed doesn't throw
            expect(() => {
                effectThree.emitReversed('test', { data: 'test' })
            }).not.toThrow()
        })
    })
})
