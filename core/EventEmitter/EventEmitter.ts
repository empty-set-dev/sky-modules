import assume from '../assume'

/**
 * Type-safe event emitter with generic event map
 *
 * EventEmitter provides a strongly-typed event system where:
 * - Each event name maps to a specific callback signature
 * - TypeScript enforces correct argument types for emit/on/off
 * - Supports wildcard listeners via onAny
 * - Can extend functions to add event capabilities
 *
 * @example
 * ```typescript
 * interface Events {
 *   click: (x: number, y: number) => void
 *   change: (value: string) => void
 *   error: (error: Error) => void
 * }
 *
 * const emitter = new EventEmitter<Events>()
 *
 * // Type-safe event listening
 * emitter.on('click', (x, y) => {
 *   console.log(`Clicked at ${x}, ${y}`)
 * })
 *
 * // Type-safe event emission
 * emitter.emit('click', 10, 20)
 *
 * // Wildcard listener
 * emitter.onAny((eventName, ...args) => {
 *   console.log(`Event ${eventName}:`, args)
 * })
 * ```
 *
 * @template T - Event map interface where keys are event names and values are callback types
 */
export default class EventEmitter<T extends { [K in keyof T]: T[K] }> {
    /**
     * Initialize EventEmitter instance (used in constructors)
     *
     * @example
     * ```typescript
     * class MyClass extends EventEmitter<Events> {
     *   constructor() {
     *     EventEmitter.super(this)
     *   }
     * }
     * ```
     *
     * @param self - The instance to initialize
     */
    static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void {
        self.__listeners = {}
        self.__anyListeners = []
    }

    /**
     * Extend a function with EventEmitter capabilities
     *
     * @example
     * ```typescript
     * interface FuncEvents {
     *   called: () => void
     * }
     *
     * function myFunc() {
     *   emittableFunc.emit('called')
     *   return 'result'
     * }
     *
     * const emittableFunc = EventEmitter.extend<typeof myFunc, FuncEvents>(myFunc)
     * emittableFunc.on('called', () => console.log('Function was called'))
     * emittableFunc() // Emits 'called' event
     * ```
     *
     * @template T - Function type to extend
     * @template E - Event map for the extended function
     * @param fn - Function to extend with event capabilities
     * @returns Function with EventEmitter methods
     */
    static extend<T extends Function, E extends { [K in keyof E]: E[K] }>(
        fn: T
    ): T & EventEmitter<E> {
        assume<T & EventEmitter<E>>(fn)

        const prototype = Object.create(Object.getPrototypeOf(fn))
        Object.assign(prototype, {
            on: EventEmitter.prototype.on,
            off: EventEmitter.prototype.off,
            emit: EventEmitter.prototype.emit,
            onAny: EventEmitter.prototype.onAny,
            offAll: EventEmitter.prototype.offAll,
        })
        Object.setPrototypeOf(fn, prototype)
        fn['__listeners'] = {} as Record<keyof E, undefined | ((...args: unknown[]) => void)[]>
        fn['__anyListeners'] = [] as ((...args: unknown[]) => void)[]
        return fn as T & EventEmitter<E>
    }

    private __listeners: {
        [K in keyof T]?: ((...args: unknown[]) => void)[]
    } = {}

    private __anyListeners: ((...args: unknown[]) => void)[] = []

    /**
     * Register an event listener
     *
     * @example
     * ```typescript
     * emitter.on('click', (x, y) => {
     *   console.log(x, y)
     * })
     * ```
     *
     * @template K - Event name type
     * @param ev - Event name to listen to
     * @param callback - Callback function matching event signature
     * @returns this for chaining
     */
    on<K extends keyof T>(ev: K, callback: T[K]): this {
        this.__listeners ??= {}
        const eventsList = (this.__listeners[ev] ??= [])
        eventsList.push(callback)
        return this
    }

    /**
     * Register a wildcard listener that receives all events
     *
     * @example
     * ```typescript
     * emitter.onAny((eventName, ...args) => {
     *   console.log(`Event ${eventName}:`, args)
     * })
     * ```
     *
     * @template T - Callback argument types
     * @param callback - Callback receiving event name and all arguments
     * @returns this for chaining
     */
    onAny<T extends []>(callback: (...args: T) => void): this {
        this.__anyListeners ??= []
        this.__anyListeners.push(callback)
        return this
    }

    /**
     * Unregister an event listener
     *
     * @example
     * ```typescript
     * const handler = (x, y) => console.log(x, y)
     * emitter.on('click', handler)
     * emitter.off('click', handler)
     * ```
     *
     * @template K - Event name type
     * @param ev - Event name to stop listening to
     * @param callback - Callback to remove
     * @returns this for chaining
     */
    off<K extends keyof T>(ev: K, callback: T[K]): this {
        const eventsList = this.__listeners[ev]
        eventsList && eventsList.remove(callback)
        return this
    }

    /**
     * Remove all event listeners
     *
     * @example
     * ```typescript
     * emitter.offAll() // Clear all listeners
     * ```
     *
     * @returns this for chaining
     */
    offAll(): this {
        this.__listeners = {}
        this.__anyListeners = []
        return this
    }

    /**
     * Emit an event with arguments
     *
     * @example
     * ```typescript
     * emitter.emit('click', 10, 20)
     * emitter.emit('change', 'new value')
     * ```
     *
     * @template K - Event name type
     * @param ev - Event name to emit
     * @param args - Arguments matching the event signature
     * @returns this for chaining
     */
    emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]> & []): this {
        const eventsList = this.__listeners[ev]
        if (eventsList != null) eventsList.forEach(cb => cb(...args))

        // Call any listeners
        if (this.__anyListeners != null) {
            this.__anyListeners.forEach(cb => cb(ev, ...args))
        }

        return this
    }
}
