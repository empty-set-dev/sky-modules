import { describe, it, expect, beforeEach, vi } from 'vitest'

import Effect from '../Effect'
import EffectTree from '../EffectTree'
import internal from '../internal'

describe('Effect', () => {
    let effectThree: EffectTree

    beforeEach(() => {
        effectThree = new EffectTree()
    })

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
        expect(callback).toHaveBeenCalled()
    })

    it('should handle array dependency with context constructor', () => {
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        const context = new TestContext()
        effectThree.addContext(context)
        effectThree.commit()
        const effect = new Effect([effectThree, TestContext as any])
        expect(effect.root).toBe(effectThree)
    })

    it('should handle callback with no cleanup function', () => {
        const callback = vi.fn(() => undefined)
        const effect = new Effect(callback, effectThree)
        expect(callback).toHaveBeenCalled()
    })

    it('should handle disposal', () => {
        const cleanup = vi.fn()
        const callback = vi.fn(() => cleanup)
        const effect = new Effect(callback, effectThree)
        effect.dispose()
        expect(effect.disposed).toBe(true)
        expect(cleanup).toHaveBeenCalled()
    })

    it('should test removeParent method', () => {
        const parent = new Effect(effectThree)
        const child = new Effect(parent)
        const result = child.removeParent(parent)
        expect(result).toBe(child)
    })

    it('should test removeParents method', () => {
        const parent1 = new Effect(effectThree)
        const parent2 = new Effect(effectThree)
        const child = new Effect(parent1)
        const result = child.removeParents(parent1, parent2)
        expect(result).toBe(child)
    })

    it('should test addDeps method', () => {
        const effect = new Effect(effectThree)
        const dep1 = new Effect(effectThree)
        const dep2 = new Effect(effectThree)
        const result = effect.addDeps(dep1, dep2)
        expect(result).toBe(effect)
    })

    it('should test removeDeps method', () => {
        const effect = new Effect(effectThree)
        const dep1 = new Effect(effectThree)
        const result = effect.removeDeps(dep1)
        expect(result).toBe(effect)
    })

    it('should test isChildOf method', () => {
        const parent = new Effect(effectThree)
        const child = new Effect(parent)
        child['__parents'] = [parent as any]
        expect(child.isChildOf(parent)).toBe(true)
        expect(child.isChildOf(new Effect(effectThree))).toBe(false)
    })

    it('should manage contexts', () => {
        const effect = new Effect(effectThree)
        class TestContext {
            static context = 'TestContext'
            value: string
            constructor(value: string) { this.value = value }
        }
        effect.addContext(new TestContext('test'))
        effectThree.commit()
        const retrievedContext = effect.context(TestContext)
        expect(retrievedContext?.value).toBe('test')
    })

    it('should test __initContexts with Effect parent', () => {
        const parentEffect = new Effect(effectThree)
        const childEffect = new Effect(parentEffect)
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        parentEffect['_contexts'] = { TestContext: new TestContext() }
        childEffect['__parents'] = [parentEffect as any]
        childEffect['__isParentContextsResolved'] = false
        childEffect['__initContexts']()
        expect(childEffect['_contexts']['TestContext']).toBeDefined()
    })

    it('should test __initContexts with non-Effect parent', () => {
        const parentBase = new (class extends internal.EffectBase {
            get root() { return effectThree }
        })()
        const childEffect = new Effect(effectThree)
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        parentBase['_contexts'] = { TestContext: new TestContext() }
        childEffect['__parents'] = [parentBase as any]
        childEffect['__isParentContextsResolved'] = false
        childEffect['__initContexts']()
        expect(childEffect['_contexts']['TestContext']).toBeDefined()
    })


    it('should handle null and undefined parents gracefully', () => {
        expect(() => new Effect(null as any)).toThrow('Effect: missing parent')
        expect(() => new Effect(undefined as any)).toThrow('Effect: missing parent')
    })

    it('should test dispose with _disposeStatus logic', async () => {
        const parent = new Effect(effectThree)
        const child = new Effect(parent)
        parent['_children'] = [child as any]
        child['__parents'] = [parent as any]
        await parent.dispose()
        expect(parent.disposed).toBe(true)
    })
})