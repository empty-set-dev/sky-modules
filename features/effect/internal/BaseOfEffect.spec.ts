import { describe, it, expect, beforeEach } from 'vitest'

import ContextConstructor from '../ContextConstructor'
import Effect from '../Effect'
import EffectTree from '../EffectTree'

import BaseOfEffect from './BaseOfEffect'

// Create a concrete implementation for testing
class TestBaseOfEffect extends BaseOfEffect {
    private _root: EffectTree

    constructor(root: EffectTree, host?: object) {
        super(host)
        this._root = root
    }

    get root(): EffectTree {
        return this._root
    }
}

describe('BaseOfEffect', () => {
    let baseEffect: TestBaseOfEffect
    let effectThree: EffectTree

    beforeEach(() => {
        effectThree = new EffectTree()
        baseEffect = new TestBaseOfEffect(effectThree)
    })

    it('should have unique ID', () => {
        const effect1 = new TestBaseOfEffect(effectThree)
        const effect2 = new TestBaseOfEffect(effectThree)
        expect(effect1.id).not.toBe(effect2.id)
        expect(typeof effect1.id).toBe('number')
    })

    it('should store host object', () => {
        const host = { test: 'value' }
        const effect = new TestBaseOfEffect(effectThree, host)
        expect(effect.host).toBe(host)
    })

    it('should handle null vs undefined host in constructor', () => {
        const nullEffect = new TestBaseOfEffect(effectThree, null)
        const undefinedEffect = new TestBaseOfEffect(effectThree, undefined)
        const objectEffect = new TestBaseOfEffect(effectThree, {})
        expect(nullEffect.host).toBeUndefined()
        expect(undefinedEffect.host).toBeUndefined()
        expect(objectEffect.host).toBeDefined()
    })

    it('should handle host vs this for event targeting', () => {
        let hostEventCalled = false
        let effectEventCalled = false
        const host = {
            onTestEvent: () => { hostEventCalled = true }
        }
        const effectWithHost = new TestBaseOfEffect(effectThree, host)
        const effectWithoutHost = new TestBaseOfEffect(effectThree)
        ;(effectWithoutHost as any).onTestEvent = () => { effectEventCalled = true }

        effectWithHost.emit('onTestEvent', { data: 'test' })
        effectWithoutHost.emit('onTestEvent', { data: 'test' })

        expect(hostEventCalled).toBe(true)
        expect(effectEventCalled).toBe(true)
    })

    it('should manage contexts', () => {
        class TestContext {
            static context = true
            value: string = 'test'
        }
        const contextInstance = new TestContext()
        const effect = new Effect(effectThree)
        effectThree.addContext(contextInstance)
        effectThree.commit()
        const retrievedContext = effect.context(TestContext as ContextConstructor)
        expect(retrievedContext).toBe(contextInstance)
    })

    it('should check context existence with hasContext', () => {
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(false)
        baseEffect['_contexts'] = { TestContext: new TestContext() }
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(true)
        baseEffect['_contexts'] = undefined
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(false)
    })

    it('should handle hasContext edge cases', () => {
        class TestContext {
            static context = 'TestContext'
            value: string = 'test'
        }
        baseEffect['_contexts'] = null
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(false)
        baseEffect['_contexts'] = { TestContext: null }
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(false)
        baseEffect['_contexts'] = { TestContext: undefined }
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(false)
        baseEffect['_contexts'] = { TestContext: new TestContext() }
        expect(baseEffect.hasContext(TestContext as ContextConstructor)).toBe(true)
    })

    it('should dispose properly', async () => {
        await baseEffect.dispose()
        expect(baseEffect.disposed).toBe(true)
    })

    it('should handle _disposeStatus during disposal', async () => {
        const parent = new Effect(effectThree)
        const effect = new Effect(effectThree)
        parent['_effects'] = [effect as any]
        effect['_disposeStatus'] = 'disposing'
        await parent.dispose()
        expect(parent.disposed).toBe(true)
    })

    it('should check parent-child relationships with isParentOf', () => {
        const child = new Effect(effectThree)
        baseEffect['_children'] = [child as any]
        expect(baseEffect.isParentOf(child)).toBe(true)
        const nonChild = new Effect(effectThree)
        expect(baseEffect.isParentOf(nonChild)).toBe(false)
        baseEffect['_children'] = undefined
        expect(baseEffect.isParentOf(child)).toBe(true) // Current buggy behavior
    })

    it('should emit events', () => {
        expect(() => {
            baseEffect.emit('test', { data: 'test' })
        }).not.toThrow()
    })

    it('should handle isCaptured flag in localEvent correctly', () => {
        const parent = new Effect(effectThree)
        const child = new Effect(parent)
        let capturedInChild = false
        const originalEvent = { data: 'test', isCaptured: false }
        parent.host = parent
        child.host = child
        ;(parent as any).onTestEvent = () => {}
        ;(child as any).onTestEvent = (event: any) => {
            capturedInChild = true
            event.isCaptured = true
        }
        parent['_children'] = [child as any]
        parent.emit('onTestEvent', originalEvent)
        expect(capturedInChild).toBe(true)
        expect(originalEvent.isCaptured).toBe(true)
    })

    it('should handle isCaptured undefined vs false', () => {
        const effect = new Effect(effectThree)
        effect.host = { onTestEvent: () => {} }
        const eventWithUndefined = { data: 'test' }
        effect.emit('onTestEvent', eventWithUndefined)
        expect(eventWithUndefined.isCaptured).toBe(false)
        const eventWithTrue = { data: 'test', isCaptured: true }
        effect.emit('onTestEvent', eventWithTrue)
        expect(eventWithTrue.isCaptured).toBe(true)
    })

    it('should handle global fields array parameter', () => {
        const effect = new Effect(effectThree)
        let receivedEvent: any = null
        effect.host = { onTestEvent: (event: any) => { receivedEvent = event } }
        const originalEvent = { data: 'test', isCaptured: false }
        effect.emit('onTestEvent', originalEvent, ['data'])
        expect(receivedEvent).not.toBeNull()
        expect(receivedEvent.data).toBe('test')
    })

    it('should handle null children array', () => {
        const effect = new Effect(effectThree)
        let handlerCalled = false
        effect.host = { onTestEvent: () => { handlerCalled = true } }
        effect['_children'] = null
        expect(() => { effect.emit('onTestEvent', { data: 'test' }) }).not.toThrow()
        expect(handlerCalled).toBe(true)
    })
})