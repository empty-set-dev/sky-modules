import { describe, it, expect, vi } from 'vitest'

import ContextConstructor from './ContextConstructor'
import EffectDep from './EffectDep'
import EffectThree from './EffectThree'
import internal from './internal'

describe('EffectDep', () => {
    it('should accept BaseOfEffect as dependency', () => {
        const effectThree = new EffectThree()

        // TypeScript compilation test - should not throw
        const dep: EffectDep = effectThree
        expect(dep).toBe(effectThree)
    })

    it('should accept tuple of BaseOfEffect and ContextConstructor', () => {
        const effectThree = new EffectThree()

        class TestContext {
            static context = 'TestContext'
            value: string
            constructor(value: string) {
                this.value = value
            }
        }

        // TypeScript compilation test - should not throw
        const dep: EffectDep = [effectThree, TestContext as ContextConstructor]
        expect(Array.isArray(dep)).toBe(true)
        expect(dep[0]).toBe(effectThree)
        expect(dep[1]).toBe(TestContext)
    })

    it('should work with different BaseOfEffect implementations', () => {
        class CustomEffect extends internal.BaseOfEffect {
            get isCustom(): boolean {
                return true
            }
        }

        const customEffect = new CustomEffect()
        const dep: EffectDep = customEffect

        expect(dep).toBe(customEffect)
    })

    it('should maintain type safety', () => {
        const effectThree = new EffectThree()

        // These should be valid EffectDep types
        const deps: EffectDep[] = [effectThree, [effectThree, Object as ContextConstructor]]

        expect(deps).toHaveLength(2)
        expect(deps[0]).toBe(effectThree)
        expect(Array.isArray(deps[1])).toBe(true)
    })
})
