import '@sky-modules/platform/node'
import '@sky-modules/core/Array'
import '@sky-modules/core/as'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import EventEmitter from './EventEmitter'

describe('EventEmitter', () => {
    interface TestEvents {
        simple: () => void
        withArgs: (arg1: string, arg2: number) => void
        multiple: (data: string) => void
    }

    let emitter: EventEmitter<TestEvents>

    beforeEach(() => {
        emitter = new EventEmitter<TestEvents>()
        EventEmitter.super(emitter)
    })

    describe('basic functionality', () => {
        test('creates instance correctly', () => {
            expect(emitter).toBeInstanceOf(EventEmitter)
        })

        test('on() registers event listener', () => {
            const handler = vi.fn()
            emitter.on('simple', handler)
            emitter.emit('simple')

            expect(handler).toHaveBeenCalledTimes(1)
        })

        test('on() returns this for chaining', () => {
            const result = emitter.on('simple', () => {})
            expect(result).toBe(emitter)
        })

        test('emit() triggers registered listeners', () => {
            const handler = vi.fn()
            emitter.on('simple', handler)
            emitter.emit('simple')

            expect(handler).toHaveBeenCalled()
        })

        test('emit() returns this for chaining', () => {
            const result = emitter.emit('simple')
            expect(result).toBe(emitter)
        })

        test('emit() does nothing if no listeners', () => {
            expect(() => emitter.emit('simple')).not.toThrow()
        })

        test('off() removes specific listener', () => {
            const handler = vi.fn()
            emitter.on('simple', handler)
            emitter.off('simple', handler)
            emitter.emit('simple')

            expect(handler).not.toHaveBeenCalled()
        })

        test('off() returns this for chaining', () => {
            const handler = () => {}
            emitter.on('simple', handler)
            const result = emitter.off('simple', handler)
            expect(result).toBe(emitter)
        })

        test('off() does nothing if no listeners', () => {
            expect(() => emitter.off('simple', () => {})).not.toThrow()
        })
    })

    describe('event arguments', () => {
        test('passes arguments to listeners', () => {
            const handler = vi.fn()
            emitter.on('withArgs', handler)
            emitter.emit('withArgs', 'hello', 42)

            expect(handler).toHaveBeenCalledWith('hello', 42)
        })

        test('passes correct arguments to multiple listeners', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()

            emitter.on('withArgs', handler1)
            emitter.on('withArgs', handler2)
            emitter.emit('withArgs', 'test', 123)

            expect(handler1).toHaveBeenCalledWith('test', 123)
            expect(handler2).toHaveBeenCalledWith('test', 123)
        })

        test('handles events without arguments', () => {
            const handler = vi.fn()
            emitter.on('simple', handler)
            emitter.emit('simple')

            expect(handler).toHaveBeenCalledWith()
        })
    })

    describe('multiple listeners', () => {
        test('allows multiple listeners for same event', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()
            const handler3 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('simple', handler2)
            emitter.on('simple', handler3)

            emitter.emit('simple')

            expect(handler1).toHaveBeenCalledTimes(1)
            expect(handler2).toHaveBeenCalledTimes(1)
            expect(handler3).toHaveBeenCalledTimes(1)
        })

        test('calls listeners in registration order', () => {
            const order: number[] = []

            emitter.on('simple', () => order.push(1))
            emitter.on('simple', () => order.push(2))
            emitter.on('simple', () => order.push(3))

            emitter.emit('simple')

            expect(order).toEqual([1, 2, 3])
        })

        test('removes only specified listener', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('simple', handler2)

            emitter.off('simple', handler1)
            emitter.emit('simple')

            expect(handler1).not.toHaveBeenCalled()
            expect(handler2).toHaveBeenCalled()
        })

        test('handles same listener registered multiple times', () => {
            const handler = vi.fn()

            emitter.on('simple', handler)
            emitter.on('simple', handler)

            emitter.emit('simple')

            expect(handler).toHaveBeenCalledTimes(2)
        })

        test('removes only one instance when same listener registered multiple times', () => {
            const handler = vi.fn()

            emitter.on('simple', handler)
            emitter.on('simple', handler)

            emitter.off('simple', handler)
            emitter.emit('simple')

            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

    describe('method chaining', () => {
        test('chains on() calls', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()

            emitter.on('simple', handler1).on('withArgs', handler2)

            emitter.emit('simple')
            emitter.emit('withArgs', 'test', 123)

            expect(handler1).toHaveBeenCalled()
            expect(handler2).toHaveBeenCalled()
        })

        test('chains emit() calls', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('multiple', handler2)

            emitter.emit('simple').emit('multiple', 'data')

            expect(handler1).toHaveBeenCalled()
            expect(handler2).toHaveBeenCalled()
        })

        test('chains mixed method calls', () => {
            const handler = vi.fn()

            emitter.on('simple', handler).emit('simple').off('simple', handler).emit('simple')

            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

    describe('class extension', () => {
        test('works with class extending EventEmitter', () => {
            class TestClass extends EventEmitter<TestEvents> {
                constructor() {
                    super()
                    EventEmitter.super(this)
                }

                trigger() {
                    this.emit('simple')
                }
            }

            const instance = new TestClass()
            const handler = vi.fn()

            instance.on('simple', handler)
            instance.trigger()

            expect(handler).toHaveBeenCalled()
        })

        test('maintains separate listeners per instance', () => {
            class TestClass extends EventEmitter<TestEvents> {
                constructor() {
                    super()
                    EventEmitter.super(this)
                }
            }

            const instance1 = new TestClass()
            const instance2 = new TestClass()

            const handler1 = vi.fn()
            const handler2 = vi.fn()

            instance1.on('simple', handler1)
            instance2.on('simple', handler2)

            instance1.emit('simple')

            expect(handler1).toHaveBeenCalled()
            expect(handler2).not.toHaveBeenCalled()
        })
    })

    describe('EventEmitter.extend()', () => {
        test('extends function with event emitter capabilities', () => {
            interface FnEvents {
                called: (arg: string) => void
            }

            function testFn(arg: string) {
                testFn.emit('called', arg)
                return arg
            }

            EventEmitter.extend<typeof testFn, FnEvents>(testFn)

            const handler = vi.fn()
            testFn.on('called', handler)
            testFn('hello')

            expect(handler).toHaveBeenCalledWith('hello')
        })

        test('extended function maintains original behavior', () => {
            interface FnEvents {
                execute: () => void
            }

            function multiply(a: number, b: number) {
                return a * b
            }

            EventEmitter.extend<typeof multiply, FnEvents>(multiply)

            expect(multiply(3, 4)).toBe(12)
        })

        test('extended function has separate event listeners', () => {
            interface Events1 {
                event: () => void
            }
            interface Events2 {
                event: () => void
            }

            function fn1() {}
            function fn2() {}

            EventEmitter.extend<typeof fn1, Events1>(fn1)
            EventEmitter.extend<typeof fn2, Events2>(fn2)

            const handler1 = vi.fn()
            const handler2 = vi.fn()

            fn1.on('event', handler1)
            fn2.on('event', handler2)

            fn1.emit('event')

            expect(handler1).toHaveBeenCalled()
            expect(handler2).not.toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        test('handles listener that throws error', () => {
            const handler1 = vi.fn(() => {
                throw new Error('Handler error')
            })
            const handler2 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('simple', handler2)

            expect(() => emitter.emit('simple')).toThrow('Handler error')
            expect(handler1).toHaveBeenCalled()
            // handler2 may or may not be called depending on implementation
        })

        test('handles removing listener during emit', () => {
            const handler1 = vi.fn(() => {
                emitter.off('simple', handler2)
            })
            const handler2 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('simple', handler2)

            emitter.emit('simple')

            expect(handler1).toHaveBeenCalled()
            // Behavior depends on implementation
        })

        test('handles adding listener during emit', () => {
            const handler2 = vi.fn()
            const handler1 = vi.fn(() => {
                emitter.on('simple', handler2)
            })

            emitter.on('simple', handler1)
            emitter.emit('simple')

            expect(handler1).toHaveBeenCalled()
            expect(handler2).not.toHaveBeenCalled() // Not called in same emit

            emitter.emit('simple')
            expect(handler2).toHaveBeenCalled() // Called in next emit
        })

        test('handles empty event name', () => {
            interface EmptyEvents {
                '': () => void
            }

            const emptyEmitter = new EventEmitter<EmptyEvents>()
            EventEmitter.super(emptyEmitter)

            const handler = vi.fn()
            emptyEmitter.on('', handler)
            emptyEmitter.emit('')

            expect(handler).toHaveBeenCalled()
        })

        test('works without calling EventEmitter.super()', () => {
            const unsafeEmitter = new EventEmitter<TestEvents>()
            const handler = vi.fn()

            // Should initialize lazily
            unsafeEmitter.on('simple', handler)
            unsafeEmitter.emit('simple')

            expect(handler).toHaveBeenCalled()
        })
    })

    describe('onAny and offAll methods', () => {
        test('onAny() listens to all events', () => {
            const anyHandler = vi.fn()
            const simpleHandler = vi.fn()

            emitter.onAny(anyHandler)
            emitter.on('simple', simpleHandler)

            emitter.emit('simple')

            expect(simpleHandler).toHaveBeenCalledTimes(1)
            expect(anyHandler).toHaveBeenCalledTimes(1)
            expect(anyHandler).toHaveBeenCalledWith('simple')
        })

        test('onAny() receives event name and arguments', () => {
            const anyHandler = vi.fn()

            emitter.onAny(anyHandler)
            emitter.emit('withArgs', 'hello', 42)

            expect(anyHandler).toHaveBeenCalledWith('withArgs', 'hello', 42)
        })

        test('onAny() receives all events', () => {
            const anyHandler = vi.fn()

            emitter.onAny(anyHandler)
            emitter.emit('simple')
            emitter.emit('withArgs', 'test', 123)
            emitter.emit('multiple', 'data')

            expect(anyHandler).toHaveBeenCalledTimes(3)
            expect(anyHandler).toHaveBeenNthCalledWith(1, 'simple')
            expect(anyHandler).toHaveBeenNthCalledWith(2, 'withArgs', 'test', 123)
            expect(anyHandler).toHaveBeenNthCalledWith(3, 'multiple', 'data')
        })

        test('onAny() allows multiple any listeners', () => {
            const anyHandler1 = vi.fn()
            const anyHandler2 = vi.fn()

            emitter.onAny(anyHandler1)
            emitter.onAny(anyHandler2)
            emitter.emit('simple')

            expect(anyHandler1).toHaveBeenCalled()
            expect(anyHandler2).toHaveBeenCalled()
        })

        test('onAny() returns this for chaining', () => {
            const anyHandler = vi.fn()
            const result = emitter.onAny(anyHandler)

            expect(result).toBe(emitter)
        })

        test('offAll() removes all listeners', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()
            const anyHandler = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('withArgs', handler2)
            emitter.onAny(anyHandler)

            emitter.offAll()

            emitter.emit('simple')
            emitter.emit('withArgs', 'test', 123)

            expect(handler1).not.toHaveBeenCalled()
            expect(handler2).not.toHaveBeenCalled()
            expect(anyHandler).not.toHaveBeenCalled()
        })

        test('offAll() returns this for chaining', () => {
            const result = emitter.offAll()
            expect(result).toBe(emitter)
        })

        test('offAll() followed by new listeners works', () => {
            const oldHandler = vi.fn()
            const newHandler = vi.fn()

            emitter.on('simple', oldHandler)
            emitter.offAll()
            emitter.on('simple', newHandler)
            emitter.emit('simple')

            expect(oldHandler).not.toHaveBeenCalled()
            expect(newHandler).toHaveBeenCalled()
        })

        test('onAny() works after offAll()', () => {
            const oldAnyHandler = vi.fn()
            const newAnyHandler = vi.fn()

            emitter.onAny(oldAnyHandler)
            emitter.offAll()
            emitter.onAny(newAnyHandler)
            emitter.emit('simple')

            expect(oldAnyHandler).not.toHaveBeenCalled()
            expect(newAnyHandler).toHaveBeenCalled()
        })
    })

    describe('memory management', () => {
        test('removing all listeners frees memory', () => {
            const handler1 = vi.fn()
            const handler2 = vi.fn()
            const handler3 = vi.fn()

            emitter.on('simple', handler1)
            emitter.on('simple', handler2)
            emitter.on('simple', handler3)

            emitter.off('simple', handler1)
            emitter.off('simple', handler2)
            emitter.off('simple', handler3)

            emitter.emit('simple')

            expect(handler1).not.toHaveBeenCalled()
            expect(handler2).not.toHaveBeenCalled()
            expect(handler3).not.toHaveBeenCalled()
        })

        test('supports many events', () => {
            interface ManyEvents {
                event1: () => void
                event2: () => void
                event3: () => void
                event4: () => void
                event5: () => void
            }

            const manyEmitter = new EventEmitter<ManyEvents>()
            EventEmitter.super(manyEmitter)

            const handlers = {
                event1: vi.fn(),
                event2: vi.fn(),
                event3: vi.fn(),
                event4: vi.fn(),
                event5: vi.fn(),
            }

            manyEmitter.on('event1', handlers.event1)
            manyEmitter.on('event2', handlers.event2)
            manyEmitter.on('event3', handlers.event3)
            manyEmitter.on('event4', handlers.event4)
            manyEmitter.on('event5', handlers.event5)

            manyEmitter.emit('event1')
            manyEmitter.emit('event3')
            manyEmitter.emit('event5')

            expect(handlers.event1).toHaveBeenCalled()
            expect(handlers.event2).not.toHaveBeenCalled()
            expect(handlers.event3).toHaveBeenCalled()
            expect(handlers.event4).not.toHaveBeenCalled()
            expect(handlers.event5).toHaveBeenCalled()
        })
    })
})
