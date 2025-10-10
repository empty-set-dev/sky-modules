import { describe, it, expect, beforeEach, vi } from 'vitest'

import Effect from './Effect'
import EffectThree from './EffectThree'

describe('Effect', () => {
    let effectThree: EffectThree

    beforeEach(() => {
        effectThree = new EffectThree()
    })

    describe('constructor', () => {
        it('should create effect with dependency only', () => {
            const effect = new Effect(effectThree)

            expect(effect.isEffect).toBe(true)
            expect(effect.root).toBe(effectThree)
        })

        it('should create effect with callback and dependency', () => {
            const cleanup = vi.fn()
            const callback = vi.fn(() => cleanup)

            const effect = new Effect(callback, effectThree)

            expect(effect.isEffect).toBe(true)
            expect(effect.root).toBe(effectThree)
            expect(callback).toHaveBeenCalled()
        })

        it('should create effect with callback, dependency and host', () => {
            const cleanup = vi.fn()
            const callback = vi.fn(() => cleanup)
            const host = {}

            const effect = new Effect(callback, effectThree, host)

            expect(effect.isEffect).toBe(true)
            expect(effect.root).toBe(effectThree)
            expect(callback).toHaveBeenCalled()
        })
    })

    describe('lifecycle', () => {
        it('should handle disposal', () => {
            const cleanup = vi.fn()
            const callback = vi.fn(() => cleanup)

            const effect = new Effect(callback, effectThree)

            effect.dispose()

            expect(effect.disposed).toBe(true)
            expect(cleanup).toHaveBeenCalled()
        })

        it('should handle async cleanup', async () => {
            const cleanup = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10))
            })
            const callback = vi.fn(() => cleanup)

            const effect = new Effect(callback, effectThree)

            await effect.dispose()

            expect(effect.disposed).toBe(true)
            expect(cleanup).toHaveBeenCalled()
        })
    })

    describe('dependencies', () => {
        it('should create effects with dependency relationships', () => {
            const parent = new Effect(effectThree)
            const child = new Effect(effectThree)

            expect(parent.isEffect).toBe(true)
            expect(child.isEffect).toBe(true)
            expect(parent.root).toBe(effectThree)
            expect(child.root).toBe(effectThree)
        })

        it('should handle multiple effect creation', () => {
            const effect1 = new Effect(effectThree)
            const effect2 = new Effect(effectThree)

            expect(effect1.id).not.toBe(effect2.id)
            expect(effect1.disposed).toBe(false)
            expect(effect2.disposed).toBe(false)
        })
    })

    describe('events', () => {
        it('should emit events', () => {
            const effect = new Effect(effectThree)

            // Test that emit doesn't throw
            expect(() => {
                effect.emit('test', { data: 'test' })
            }).not.toThrow()
        })

        it('should handle event cleanup on disposal', () => {
            const effect = new Effect(effectThree)

            effect.dispose()

            // Test that emit still works after disposal
            expect(() => {
                effect.emit('test', { data: 'test' })
            }).not.toThrow()
        })
    })

    describe('contexts', () => {
        it('should manage contexts', () => {
            const effect = new Effect(effectThree)

            class TestContext {
                static context = 'TestContext'
                value: string
                constructor(value: string) {
                    this.value = value
                }
            }

            effect.addContext(new TestContext('test'))

            // Need to commit changes for contexts to take effect
            effectThree.commit()

            const retrievedContext = effect.context(TestContext)

            expect(retrievedContext?.value).toBe('test')
        })
    })
})
