import assume from '../assume'

export default class EventEmitter<T extends { [K in keyof T]: T[K] }> {
    static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void {
        self.__listeners = {}
        self.__anyListeners = []
    }

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

    on<K extends keyof T>(ev: K, callback: T[K]): this {
        this.__listeners ??= {}
        const eventsList = (this.__listeners[ev] ??= [])
        eventsList.push(callback)
        return this
    }

    onAny<T extends []>(callback: (...args: T) => void): this {
        this.__anyListeners ??= []
        this.__anyListeners.push(callback)
        return this
    }

    off<K extends keyof T>(ev: K, callback: T[K]): this {
        const eventsList = this.__listeners[ev]
        eventsList && eventsList.remove(callback)
        return this
    }

    offAll(): this {
        this.__listeners = {}
        this.__anyListeners = []
        return this
    }

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
