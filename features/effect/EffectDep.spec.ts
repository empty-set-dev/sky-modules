import { describe, it, expect, beforeEach } from 'vitest'

import ContextConstructor from './ContextConstructor'
import Effect from './Effect'
import EffectDep from './EffectDep'
import EffectTree from './EffectTree'

describe('EffectDep', () => {
    let effectThree: EffectTree

    beforeEach(() => {
        effectThree = new EffectTree()
    })

    it('should accept BaseOfEffect as dependency', () => {
        const dep: EffectDep = effectThree
        const effect = new Effect(dep)
        expect(effect.root).toBe(effectThree)
        expect(effect.isEffect).toBe(true)
    })

    it('should accept tuple with context constructor', () => {
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        const contextInstance = new TestContext()
        effectThree.addContext(contextInstance)
        effectThree.commit()
        const dep: EffectDep = [effectThree, TestContext as ContextConstructor]
        const effect = new Effect(dep)
        expect(Array.isArray(dep)).toBe(true)
        expect(dep[0]).toBe(effectThree)
        expect(dep[1]).toBe(TestContext)
    })

    it('should handle invalid dependencies', () => {
        expect(() => new Effect(null as any)).toThrow('Effect: missing parent')
        expect(() => new Effect(undefined as any)).toThrow('Effect: missing parent')
    })
})