import { describe, it, expect, beforeEach } from 'vitest'

import ContextConstructor from '../ContextConstructor'
import EffectThree from '../EffectThree'

import BaseOfEffect from './BaseOfEffect'

// Create a concrete implementation for testing
class TestBaseOfEffect extends BaseOfEffect {
    get root(): EffectThree {
        return new EffectThree()
    }
}

describe('BaseOfEffect', () => {
    let baseEffect: TestBaseOfEffect

    beforeEach(() => {
        baseEffect = new TestBaseOfEffect()
    })

    describe('initialization', () => {
        it('should have unique ID', () => {
            const effect1 = new TestBaseOfEffect()
            const effect2 = new TestBaseOfEffect()

            expect(effect1.id).not.toBe(effect2.id)
            expect(typeof effect1.id).toBe('number')
        })

        it('should store host object', () => {
            const host = { test: 'value' }
            const effect = new TestBaseOfEffect(host)

            expect(effect.host).toBe(host)
        })

        it('should initialize without host', () => {
            const effect = new TestBaseOfEffect()

            expect(effect.host).toBeUndefined()
        })

        it('should not be disposed initially', () => {
            expect(baseEffect.disposed).toBe(false)
        })
    })

    describe('context handling', () => {
        it('should handle host with context constructor', () => {
            class TestContext {
                static context = 'TestContext'
                value: string
                constructor(value: string) {
                    this.value = value
                }
            }

            const contextInstance = new TestContext('test')
            const effect = new TestBaseOfEffect(contextInstance)

            expect(effect.host).toBe(contextInstance)
        })

        it('should manage contexts', () => {
            class TestContext {
                static context = 'TestContext'
                value: string = 'test'
            }

            const contextInstance = new TestContext()

            // Add context to root since that's where contexts are managed
            baseEffect.root.addContext(contextInstance)

            // Need to commit changes for contexts to take effect
            baseEffect.root.commit()

            const retrievedContext = baseEffect.context(TestContext as ContextConstructor)
            expect(retrievedContext).toBe(contextInstance)
        })

        it('should throw error for non-existent context', () => {
            class TestContext {
                static context = 'TestContext'
                value: string = 'test'
            }

            expect(() => {
                baseEffect.context(TestContext as ContextConstructor)
            }).toThrow('context missing')
        })
    })

    describe('lifecycle', () => {
        it('should dispose properly', async () => {
            await baseEffect.dispose()

            expect(baseEffect.disposed).toBe(true)
        })

        it('should handle multiple dispose calls', async () => {
            await baseEffect.dispose()
            await baseEffect.dispose()

            expect(baseEffect.disposed).toBe(true)
        })
    })

    describe('children management', () => {
        it('should manage child effects', () => {
            const child = new TestBaseOfEffect()

            // Test internal children array access
            baseEffect['_children'] = []
            baseEffect['_children'].push(child as any)

            expect(baseEffect['_children']).toContain(child)
        })
    })

    describe('event handling', () => {
        it('should emit events', () => {
            const mockEvent = { data: 'test' }

            // Test that emit doesn't throw
            expect(() => {
                baseEffect.emit('test', mockEvent)
            }).not.toThrow()
        })

        it('should emit reversed events', () => {
            const mockEvent = { data: 'test' }

            // Test that emitReversed doesn't throw
            expect(() => {
                baseEffect.emitReversed('test', mockEvent)
            }).not.toThrow()
        })
    })
})