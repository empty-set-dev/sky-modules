export default class EventEmitter<T extends { [K in keyof T]: T[K] }> {
    static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void {
        self.__listeners = {}
    }

    static extend<T extends Function, E extends { [K in keyof E]: E[K] }>(
        fn: T
    ): T & EventEmitter<E> {
        as<T & EventEmitter<E>>(fn)

        const prototype = Object.create(Object.getPrototypeOf(fn))
        Object.assign(prototype, {
            on: EventEmitter.prototype.on,
            off: EventEmitter.prototype.off,
            emit: EventEmitter.prototype.emit,
        })
        Object.setPrototypeOf(fn, prototype)
        fn['__listeners'] = {} as Record<keyof E, undefined | ((...args: unknown[]) => void)[]>
        return fn as T & EventEmitter<E>
    }

    private __listeners: {
        [K in keyof T]?: ((...args: unknown[]) => void)[]
    } = {}

    on<K extends keyof T>(ev: K, callback: T[K]): this {
        this.__listeners ??= {}
        const eventsList = (this.__listeners[ev] ??= [])
        eventsList.push(callback)
        return this
    }

    onAny<T extends []>(callback: (...args: T) => void): this {
        callback
        throw new Error('Method implemented in external file')
    }

    off<K extends keyof T>(ev: K, callback: T[K]): this {
        const eventsList = this.__listeners[ev]
        eventsList && eventsList.remove(callback)
        return this
    }

    offAll(): this {
        throw new Error('Method implemented in external file')
    }

    emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]> & []): this {
        const eventsList = this.__listeners[ev]
        if (eventsList != null) eventsList.forEach(cb => cb(...args))
        return this
    }
}
